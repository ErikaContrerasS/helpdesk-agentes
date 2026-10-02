// severityRules.js — cálculo determinístico de severidad (sección 02-clasificacion.md)

function calculateSeverity({
  personasAfectadas = 1,
  duracionMinutos = 0,
  detieneOperacion = false,
  bloqueaTareaConPlazo = false,
} = {}) {
  if (detieneOperacion && personasAfectadas >= 3 && duracionMinutos >= 30) {
    return 'Alta';
  }

  if (bloqueaTareaConPlazo && personasAfectadas >= 1 && personasAfectadas <= 2) {
    return 'Media';
  }

  return 'Baja';
}

module.exports = { calculateSeverity };
