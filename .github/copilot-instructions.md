---
description: Reglas del ciclo de vida de los tickets de soporte
applyTo: "**"
---
# Ciclo de vida de tickets

## Estados permitidos

- **Nuevo** — ticket recién recibido, aún sin analizar.
- **En clasificación** — Triage está analizando o esperando aclaración del usuario.
- **Asignado** — Ya clasificado y enrutado al agente especializado.
- **En proceso** — Agente especializado, Inicia solución correspondiente.
- **Escalado** — Enviado a un humano por ambigüedad.
- **Resuelto** — Ticket Finalizado.
- **Cerrado** — Ticket Verificado.
- **Reabierto** — Usuario rechaza la solución.
- **Cancelado** — Falta de Aclaración.

## Transiciones permitidas
| De    | A                | Condición / campos obligatorios |
|-------|------------------|-----------------------------|
| Nuevo | En clasificación | Nombre, Correo, Descripción |
| En clasificación | Asignado | Triage determinó categoría, severidad, usuario afectado, servicio impactado, criticidad de negocio |
| En clasificación | Cancelado | descripción no se entiende y pasan 2 horas sin aclaración del usuario (motivo registrado: falta de comprensión) |
| Asignado | En proceso | El agente especializado inicia el trabajo |
| En proceso  | Escalado | severidad alta / fallo del script / ambigüedad / riesgo alto en aprovisionamiento|
| En proceso | Resuelto | acción concreta registrada |
| Escalado | Resuelto | el humano da una respuesta concreta |
| Escalado | Cancelado |  24 horas sin respuesta del humano (motivo registrado: timeout del humano — distinto del motivo anterior)|
| Resuelto | Cerrado | respuesta verificada |
| Resuelto | Reabierto | el usuario rechaza la solución (máx. 2 reaperturas, al superarlo fuerza Escalado) |
| Reabierto | En proceso | si viene de un rechazo en "Resuelto", mismo agente retoma |
| Reabierto | En clasificación | Si viene de "Cancelado", porque nunca se clasificó bien|
| Cancelado | Reabierto | el usuario vuelve con la aclaración que faltaba|
| En clasificación  | Escalado | ambigüedad entre categorías, requiere juicio humano|


## Transiciones prohibidas
- `Cerrado → Escalado`: debe reabrirse primero, no se escala un caso ya cerrado.
- `Escalado →  En proceso / Asignado`: (ningún agente reclama de vuelta un caso en manos de un humano).

## Condiciones de cierre

- Un ticket pasa a "Resuelto" cuando el agente registra una acción concreta (remediación aplicada, acceso otorgado, o respuesta del humano en un caso escalado).
- Un ticket pasa a "Cerrado" cuando esa respuesta queda verificada (el usuario la confirma, o no la rechaza).


## Reglas de seguridad
 - Nunca se solicita ni se guarda (credenciales, tokens, PII como cédula)
 - En caso de recibir ticket con esta información, se reemplaza el fragmento detectado por [REDACTADO] antes de guardar el ticket; nunca se almacena en su forma original ni se muestra en la bitácora.
 - Se comunica al usuario la recomendación de cambiar la clave/token expuesto
