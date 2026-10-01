## Caso 1 — Acceso e identidad
- Ticket: "Olvide mi contraseña"
- Categoría / Severidad esperada: Acceso e identidad / Media
- Flujo esperado: Triage → agente diagnostico tecnico →
 enviar un enlace de restablecimiento al correo ya registrado del usuario 
- Resultado esperado: Informar al cliente el envio del correo con los pasos para crear su nueva clave.

## Caso 2 — Infraestructura y software local
- Ticket: "Nadie en la oficina puede conectarse a la VPN desde hace una hora"
- Categoría / Severidad esperada: Infraestructura y software local / Alta
- Flujo esperado: Triage → Agente de Diagnóstico técnico →
revisar el skill de diagnostico tecnico
- Resultado esperado: El diagnóstico muestra 'VPN Corporativa: degradado, latencia elevada', por lo que el agente escala a un humano del equipo de Infraestructura, adjuntando ese resultado.

## Caso 3 — Aprovisionamiento y permisos
- Ticket: "Se necesita dar acceso al repositorio del proyecto a un cliente externo para la reunión de esta semana"
- Categoría / Severidad esperada: Aprovisionamiento y permisos / Media
- Entidad clave extraída: alcance = externo
- Flujo esperado: Triage → Agente de Aprovisionamiento  → evalúa riesgo (acceso externo) → Escalado para aprobación humana
- Resultado esperado: no se otorga el acceso automáticamente; se escala con el motivo "solicitud de acceso externo a repositorio" para que un humano decida.


## Caso 4 — Difícil (ambiguo / grave / dato sensible)
- Ticket: "Intento ingresar a la aplicación de la empresa pero no me deja"
- Primera respuesta: Triage permanece en "En clasificación" y pide aclaración (¿qué aplicación, qué error, afecta a otras personas?)
- Ticket (turno 2): "a otras personas también"
- Categoría / Severidad esperada: indeterminada — con la info adicional, sigue siendo ambigua entre Acceso e identidad e Infraestructura
- Flujo esperado: Triage → En clasificación (pide aclaración) → Escalado (al confirmarse la ambigüedad real)
- Resultado esperado: el ticket termina en "Escalado" sin categoría asignada, con ambos mensajes del usuario como contexto; un humano decide.

