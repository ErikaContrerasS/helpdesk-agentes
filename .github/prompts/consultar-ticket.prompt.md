---
name: consultar-ticket
description: Consulta el estado de un ticket existente
agent: agent
argument-hint: id-del-ticket
---
Consulta el estado del ticket con ID "${input:id-del-ticket:ID del ticket}" y proporciona información sobre su estado actual con la siguiente informacion
  - Fecha/Hora
  - Id Ticket
  - Agente
  - Estado Anterior
  - Estado Nuevo
  - Escalado a
  - Respuesta
  - Cancelado - Motivo.
