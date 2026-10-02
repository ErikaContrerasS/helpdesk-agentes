// ticketEngine.js — tabla de transiciones del ciclo de vida (01-ciclo-de-vida.md) y su validación

const TRANSICIONES_PERMITIDAS = {
  'Nuevo': ['En clasificación'],
  'En clasificación': ['Asignado', 'Cancelado', 'Escalado'],
  'Asignado': ['En proceso'],
  'En proceso': ['Escalado', 'Resuelto'],
  'Escalado': ['Resuelto'],
  'Resuelto': ['Cerrado', 'Reabierto'],
  'Reabierto': ['En proceso', 'En clasificación'],
  'Cancelado': ['Reabierto'],
  'Cerrado': [],
};

function validarTransicion(estadoActual, estadoNuevo) {
  const permitidos = TRANSICIONES_PERMITIDAS[estadoActual];

  if (!permitidos) {
    throw new Error(`Estado desconocido: "${estadoActual}"`);
  }

  if (!permitidos.includes(estadoNuevo)) {
    throw new Error(`Transición no permitida: "${estadoActual}" → "${estadoNuevo}"`);
  }

  return true;
}

module.exports = { TRANSICIONES_PERMITIDAS, validarTransicion };
