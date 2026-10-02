#!/usr/bin/env node
// triage-cli.js — recibe las entidades que el agente de Triage extrajo del texto,
// calcula la severidad y valida/registra la transición de estado. Nunca inventa el resultado.

const { calculateSeverity } = require('../src/severityRules');
const { validarTransicion } = require('../src/ticketEngine');
const { addEntry, siguienteIdTicket } = require('../src/bitacora');

function main() {
  const inputJson = process.argv[2];

  if (!inputJson) {
    console.log(JSON.stringify({ ok: false, error: 'Falta el JSON de entrada' }));
    process.exit(1);
  }

  let datos;
  try {
    datos = JSON.parse(inputJson);
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: 'JSON inválido: ' + e.message }));
    process.exit(1);
  }

  const {
    idTicket,
    estadoAnterior,
    estadoNuevo,
    categoria = null,
    personasAfectadas,
    duracionMinutos,
    detieneOperacion,
    bloqueaTareaConPlazo,
    escaladoA = null,
    motivoCancelado = null,
    resumen,
  } = datos;

  try {
    validarTransicion(estadoAnterior, estadoNuevo);

    let severidad = null;
    if (estadoNuevo === 'Asignado') {
      severidad = calculateSeverity({ personasAfectadas, duracionMinutos, detieneOperacion, bloqueaTareaConPlazo });
    }

    const idTicketFinal = idTicket || siguienteIdTicket();

    const entrada = addEntry({
      idTicket: idTicketFinal,
      agente: 'triage',
      estadoAnterior,
      estadoNuevo,
      escaladoA,
      motivoCancelado,
      resumen: resumen || `Categoría: ${categoria || 'sin determinar'}. Severidad: ${severidad || 'no aplica'}.`,
    });

    console.log(JSON.stringify({ ok: true, idTicket: idTicketFinal, categoria, severidad, estadoNuevo, entrada }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
  }
}

main();
