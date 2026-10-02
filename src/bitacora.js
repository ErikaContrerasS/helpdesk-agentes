// bitacora.js — lectura/escritura real de data/bitacora.json (01-bitacora.md)

const fs = require('fs');
const path = require('path');

const BITACORA_PATH = path.join(__dirname, '..', 'data', 'bitacora.json');

function leerBitacora() {
  const contenido = fs.readFileSync(BITACORA_PATH, 'utf8');
  return JSON.parse(contenido);
}

function siguienteIdTicket() {
  const entradas = leerBitacora();
  const idsExistentes = new Set(entradas.map((e) => e.idTicket));
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  let numero = idsExistentes.size + 1;
  let idTicket = `TCK-${fecha}-${String(numero).padStart(3, '0')}`;
  while (idsExistentes.has(idTicket)) {
    numero += 1;
    idTicket = `TCK-${fecha}-${String(numero).padStart(3, '0')}`;
  }

  return idTicket;
}

function addEntry({
  idTicket,
  agente,
  estadoAnterior,
  estadoNuevo,
  escaladoA = null,
  motivoCancelado = null,
  resumen,
}) {
  if (!idTicket || !agente || !estadoAnterior || !estadoNuevo || !resumen) {
    throw new Error('Faltan campos obligatorios para registrar la entrada en la bitácora');
  }

  const entradas = leerBitacora();

  const entrada = {
    idTicket,
    fechaHora: new Date().toISOString(),
    agente,
    estadoAnterior,
    estadoNuevo,
    escaladoA,
    motivoCancelado,
    resumen,
  };

  entradas.push(entrada);
  fs.writeFileSync(BITACORA_PATH, JSON.stringify(entradas, null, 2) + '\n');

  return entrada;
}

module.exports = { addEntry, siguienteIdTicket, leerBitacora };
