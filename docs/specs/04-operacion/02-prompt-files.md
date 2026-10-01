## 1. Crear ticket nuevo
- Variables: nombre, correo, descripción
- Pasos: Disparar el agente de Triage.

## 2. Consultar estado de un servicio
- Variables: nombre del servicio
- Pasos: Disparar el skill de diagnostico del servicio

## 3. Forzar escalamiento manual
- Variables: id del ticket, motivo
- Pasos:Cambiar el estado a Escalado, seleccionando el agente humano que se va a encargar y se registra el motivo para su trazabilidad

## 4. Consultar estado de un ticket
- Variables: id del ticket
- Pasos: consulta por el id del ticket y retorna:
  - Fecha/Hora
  - Id Ticket
  - Agente
  - Estado Anterior
  - Estado Nuevo
  - Escalado a
  - Respuesta
  - Cancelado - Motivo

