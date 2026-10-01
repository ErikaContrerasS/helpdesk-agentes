---
name: diagnostico-servicio
description: Verifica el estado operativo de un servicio (VPN, autenticación, equipos). Úsala cuando un ticket esté clasificado como Acceso e identidad o Infraestructura y software local, y necesites diagnosticar un servicio.
---
# Diagnóstico de servicio

## Cuándo usarla
- Usar esta skill cuando el ticket está clasificado en Acceso e identidad o Infraestructura y software local, y se necesita verificar el estado de un servicio específico.

- No usarla cuando el ticket es de categoría Aprovisionamiento y permisos, porque el agente de Aprovisionamiento no tiene permitido ejecutar scripts de diagnóstico técnico.

## Pasos
1. Lee el ticket y extrae las entidades: usuario afectado, servicio impactado, criticidad de negocio
2. Ejecuta: `node .github/skills/diagnostico-servicio/check-servicio.js <nombre-servicio>`
3. Interpreta el resultado: 
- Operativo: el servicio está funcionando correctamente.
- Degradado: el servicio está funcionando parcialmente, con algún error o limitación.
- Caído: el servicio no está funcionando.


## Si el script falla o no responde
- No inventes el resultado.
- Escala a un humano (Escalado) con el mensaje/descripción original y el resultado del diagnóstico que se intentó.
