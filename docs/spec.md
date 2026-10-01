# Spec — Ecosistema de Agentes Help Desk

Resumen de una página. El detalle completo está en `docs/specs/`.

## Mapa
| Sección | Resumen (1 línea) | Archivo |
|---|---|---|
| Objetivo | Soporte técnico automatizado por medio de agentes especializados para las diferentes tipologías de Soporte, es importante su automatización por temas de tiempos, de control de tiempos SLA | [01-objetivo.md](specs/00-contexto/01-objetivo.md) |
| Seguridad | Instrucciones de lo que no esta permitido con base a la seguridad | [02-seguridad.md](specs/00-contexto/02-seguridad.md) |
| Ciclo de vida | Flujo desde que recibo un ticket hasta su estado final | [01-ciclo-de-vida.md](specs/01-tickets/01-ciclo-de-vida.md) |
| Clasificación | Niveles de Severidad y entidades que extrae Triage | [02-clasificacion.md](specs/01-tickets/02-clasificacion.md) |
| Agentes | 3 agentes: Triage, Diagnóstico técnico, Aprovisionamiento | [02-agentes/](specs/02-agentes/) |
| Handoffs y escalamiento | Paso a paso de como funcionaran los agentes | [03-handoffs-y-escalamiento.md](specs/02-agentes/03-handoffs-y-escalamiento.md) |
| Skill | Realiza el diagnostico, dependiendo el script que se requiera | [03-skills/](specs/03-skills/) |
| Bitácora | Trazabilidad de los tickets | [01-bitacora.md](specs/04-operacion/01-bitacora.md) |
| Prompt files | 4 flujos: crear ticket, consultar servicio, forzar escalamiento, consultar ticket | [02-prompt-files.md](specs/04-operacion/02-prompt-files.md) |
| Aceptación | 4 casos probados en vivo, con resultados reales documentados | [05-aceptacion.md](specs/05-aceptacion.md) |
