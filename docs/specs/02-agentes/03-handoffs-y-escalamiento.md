
## HANDOFF
| De     | A                   | Cuándo                              | Contexto que recibe         |
|--------|---------------------|-------------------------------------|-----------------------------|
| Triage | Diagnóstico técnico | categoría = Acceso o Infraestructura | mensaje/descripción original y Entidades, Severidad
| Triage | Aprovisionamiento | categoría = Aprovisionamiento | tipo de acceso, interno/externo, rol solicitado
| Triage | Humano (Escalado) | ambigüedad entre categorías | mensaje/descripción original
| Diagnóstico técnico | Humano (Escalado) | severidad alta / script falla / ambigüedad | resultado del diagnóstico que se intentó  y mensaje/descripción original
| Aprovisionamiento | Humano (Escalado) | acceso de alto riesgo | evaluación de riesgo del agente, tipo de acceso, alcance, rol, y por qué se consideró alto riesgo


## Regla anti-ciclos
Escalado solo puede pasar a Resuelto. Ningún agente (Diagnóstico técnico o Aprovisionamiento) puede reclamar de vuelta un caso que ya está en manos de un humano.