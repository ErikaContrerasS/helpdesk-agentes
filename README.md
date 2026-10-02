# Ecosistema de Agentes — Mesa de Soporte (Help Desk)

## Qué resuelve
Soporte técnico automatizado por medio de agentes especializados para las diferentes tipologías de Soporte, es importante su automatización por temas de tiempos, de control de tiempos SLA
## Requisitos
- VS Code + GitHub Copilot (modo Agent)
- Node.js v24.14.0

## Arquitectura: híbrida (Node.js + Copilot)
El sistema separa dos responsabilidades distintas:
- **GitHub Copilot (Custom Agents)**: entiende el texto libre del ticket, extrae entidades (nombre, correo, categoría, servicio, tipo de acceso, etc.) y conversa con el operador.
- **Node.js (`src/` y `scripts/`)**: toma esas entidades ya estructuradas y decide — de forma determinística y probada por separado — la severidad, el riesgo, la transición de estado válida, y escribe la bitácora. El modelo de lenguaje **no** calcula reglas de negocio ni edita la bitácora directamente; siempre invoca un script.

```
src/
├── severityRules.js   # calculateSeverity() — Alta/Media/Baja, según las reglas de 02-clasificacion.md
├── ticketEngine.js    # validarTransicion() — la tabla completa del ciclo de vida, rechaza transiciones inválidas
├── riskRules.js        # evaluateRisk() — bajo/alto riesgo para Aprovisionamiento
└── bitacora.js          # addEntry() / siguienteIdTicket() — lectura/escritura real de data/bitacora.json
scripts/
├── triage-cli.js              # usado por el agente triage
├── diagnostico-cli.js         # usado por el agente diagnostico-tecnico
└── aprovisionamiento-cli.js   # usado por el agente aprovisionamiento
.github/
├── copilot-instructions.md       # Reglas del ciclo de vida y seguridad
├── agents/                       # triage, diagnostico-tecnico, aprovisionamiento (llaman a scripts/)
├── skills/diagnostico-servicio/  # SKILL.md + check-servicio.js
└── prompts/                      # 4 prompt files (crear/consultar/escalar ticket, consultar servicio)
data/
├── servicios.json                # Datos simulados para el diagnóstico de servicios
└── bitacora.json                 # Registro real de las decisiones de los agentes
docs/
├── spec.md                       # Índice de una página
└── specs/                        # Detalle completo por sección (ciclo de vida, agentes, handoffs, etc.)
```

## Cómo probar la lógica de negocio (sin necesitar Copilot)
Toda la lógica determinística se puede probar directamente con Node, sin depender de que Copilot esté disponible:

```bash
# Severidad
node -e "console.log(require('./src/severityRules').calculateSeverity({ personasAfectadas: 5, duracionMinutos: 60, detieneOperacion: true }))"
# → "Alta"

# Validación de transición de estado (detecta transiciones prohibidas)
node -e "require('./src/ticketEngine').validarTransicion('Escalado', 'En proceso')"
# → lanza Error: Transición no permitida

# Flujo completo de un ticket de Infraestructura (clasificación → diagnóstico → escalamiento)
node scripts/triage-cli.js '{"idTicket":"TCK-DEMO-001","estadoAnterior":"En clasificación","estadoNuevo":"Asignado","categoria":"Infraestructura y software local","personasAfectadas":5,"duracionMinutos":60,"detieneOperacion":true,"resumen":"Demo VPN caída"}'
node scripts/diagnostico-cli.js '{"idTicket":"TCK-DEMO-001","estadoAnterior":"Asignado","estadoServicio":"degradado","resumen":"VPN degradada"}'
cat data/bitacora.json
```

## Cómo probarlo con Copilot (flujo conversacional completo)
1. Abrir la carpeta en VS Code y marcarla como confiable (Trust).
2. Abrir el chat de Copilot en modo Agent, seleccionar el agente `triage`.
3. Enviar un ticket de ejemplo (ver `docs/specs/05-aceptacion.md` para los 4 casos probados), por ejemplo: "Erika, erika@empresa.com. Nadie en la oficina puede conectarse a la VPN desde hace una hora."
4. Seguir los handoffs que ofrezca el chat. Cada agente ejecutará su script correspondiente (`triage-cli.js`, `diagnostico-cli.js` o `aprovisionamiento-cli.js`) y pedirá tu confirmación para correrlo.
5. Revisar `data/bitacora.json` para ver el registro real de cada decisión.

## Decisiones de diseño
- **Lógica de negocio en Node.js, no en el criterio del modelo de lenguaje**: la severidad, el riesgo de aprovisionamiento, y la validación de cada transición de estado son funciones de JavaScript puras, testeadas de forma aislada. Copilot solo extrae entidades del texto y decide *cuándo* invocar cada script — no calcula las reglas de negocio. Esto hace el comportamiento determinístico y verificable con pruebas normales de Node, sin depender de que un modelo de lenguaje "recuerde" aplicar la regla correctamente cada vez.
- **`ticketEngine.js` rechaza transiciones inválidas en código**: al construir esto encontramos que, en una versión anterior donde el modelo decidía los cambios de estado por su cuenta, algunos tickets saltaban directo de "Asignado" a "Escalado" sin pasar por "En proceso" — una violación silenciosa del ciclo de vida que nadie detectó hasta que existió un validador real. Ahora es imposible que eso ocurra.
- **3 agentes, no 4**: Diagnóstico técnico cubre Acceso e identidad e Infraestructura en un solo agente, porque ambas categorías terminan resolviéndose de la misma forma: diagnosticando el estado de un servicio (autenticación, VPN, equipos).
- **Estado "Cancelado" separado de "Escalado"**: Cancelado es para cuando el ticket nunca se logró entender y no hay gestión posible (no es por falta de esfuerzo del sistema); Escalado es cuando sí se gestionó pero se necesita el criterio de un humano.
- **Bitácora como archivo real (`data/bitacora.json`)**, escrita por código (`src/bitacora.js`), no por el modelo editando el archivo directamente: para que las decisiones de los agentes sean auditables, verificables, y generadas de forma consistente.
- **Reglas de riesgo explícitas en Aprovisionamiento** (tipo de acceso, interno/externo, rol solicitado), forzadas por `riskRules.js`: el agente no puede otorgar un acceso de alto riesgo aunque "quisiera" — el script lo impide.

## Limitaciones y mejoras futuras
- El diagnóstico de servicios está simulado con `data/servicios.json`; no hay conexión real a una VPN o sistema de autenticación.
- El límite de reaperturas (máx. 2) está documentado en la regla pero no hay un contador automático en código todavía.
- No hay pruebas automatizadas (ej. con `node:test` o Jest) para `src/`; las pruebas actuales son manuales vía terminal (ver sección anterior).
- Con más tiempo: agregar un test suite real para `src/`, conectar el diagnóstico a servicios reales (ej. vía MCP), agregar métricas de SLA, y exponer la lógica de `src/` también como una API HTTP, independiente de Copilot.
