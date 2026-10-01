---
name: crear-ticket
description: Registra un ticket nuevo y dispara la clasificación
agent: triage
argument-hint: nombre, correo, descripción del problema
---
Procesa un ticket nuevo con estos datos:
- Nombre: ${input:nombre:Nombre del usuario}
- Correo: ${input:correo:Correo del usuario}
- Descripción: ${input:descripcion:Describe el problema}

1. Clasifica el ticket según las reglas del ciclo de vida.
2. Extrae las entidades necesarias.
3. Decide a qué agente enrutar, o si escala/cancela.
4. Registra la decisión en la bitácora.
