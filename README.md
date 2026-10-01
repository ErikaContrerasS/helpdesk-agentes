# Ecosistema de Agentes — Mesa de Soporte (Help Desk)

## Qué resuelve
Soporte técnico automatizado por medio de agentes especializados para las diferentes tipologías de Soporte, es importante su automatización por temas de tiempos, de control de tiempos SLA
## Requisitos
- VS Code + GitHub Copilot (modo Agent)
- Node.js v24.14.0

## Estructura
```
.github/
├── copilot-instructions.md       # Reglas del ciclo de vida y seguridad
├── agents/                       # triage, diagnostico-tecnico, aprovisionamiento
├── skills/diagnostico-servicio/  # SKILL.md + check-servicio.js
└── prompts/                      # 4 prompt files (crear/consultar/escalar ticket, consultar servicio)
data/
├── servicios.json                # Datos simulados para el diagnóstico de servicios
└── bitacora.json                 # Registro real de las decisiones de los agentes
docs/
├── spec.md                       # Índice de una página
└── specs/                        # Detalle completo por sección (ciclo de vida, agentes, handoffs, etc.)
```

## Cómo probarlo
1. Abrir la carpeta en VS Code y marcarla como confiable (Trust).
2. Abrir el chat de Copilot en modo Agent, seleccionar el agente `triage`.
3. Enviar un ticket de ejemplo (ver `docs/specs/05-aceptacion.md` para los 4 casos probados), por ejemplo: "Erika, erika@empresa.com. Nadie en la oficina puede conectarse a la VPN desde hace una hora."
4. Seguir los handoffs que ofrezca el chat y revisar `data/bitacora.json` para ver el registro de cada decisión.

## Decisiones de diseño
- **3 agentes, no 4**: Diagnóstico técnico cubre Acceso e identidad e Infraestructura en un solo agente, porque ambas categorías terminan resolviéndose de la misma forma: diagnosticando el estado de un servicio (autenticación, VPN, equipos).
- **Estado "Cancelado" separado de "Escalado"**: Cancelado es para cuando el ticket nunca se logró entender y no hay gestión posible (no es por falta de esfuerzo del sistema); Escalado es cuando sí se gestionó pero se necesita el criterio de un humano.
- **Bitácora como archivo real (`data/bitacora.json`)**, no solo una mención en el chat: para que las decisiones de los agentes sean auditables y verificables, tal como lo exige el PDF de la prueba.
- **Reglas de riesgo explícitas en Aprovisionamiento** (tipo de acceso, interno/externo, rol solicitado): permiten que el agente resuelva solo los casos de bajo riesgo y escale automáticamente los de alto riesgo, sin intervención humana para decidir eso.

## Limitaciones y mejoras futuras
- El diagnóstico de servicios está simulado con `data/servicios.json`; no hay conexión real a una VPN o sistema de autenticación.
- El límite de reaperturas (máx. 2) está documentado en la regla pero no hay un contador automático en código.
- Con más tiempo: conectar el diagnóstico a servicios reales (ej. vía MCP), agregar métricas de SLA, y ampliar la evaluación con más casos de prueba automatizados.
