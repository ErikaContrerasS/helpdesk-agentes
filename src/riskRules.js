// riskRules.js — evaluación de riesgo para el Agente de Aprovisionamiento

function evaluateRisk({ tipoAcceso, alcance, rolSolicitado } = {}) {
  const esAltoRiesgo =
    tipoAcceso === 'escritura' ||
    alcance === 'externo' ||
    rolSolicitado === 'admin';

  return esAltoRiesgo ? 'alto' : 'bajo';
}

module.exports = { evaluateRisk };
