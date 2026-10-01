---
name: forzar-escalamiento
description: Forza el escalamiento de un ticket existente
agent: agent
argument-hint: id-del-ticket, motivo
---
Fuerza el escalamiento de un ticket existente:
- ID: ${input:id-del-ticket:ID del ticket}
- Motivo: ${input:motivo:Motivo del escalamiento}

1. Cambia el estado del ticket a "Escalado", seleccionando el agente humano que se va a encargar.
2. Registra la decisión en la bitácora.
