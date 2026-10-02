#!/usr/bin/env node
// aprovisionamiento-cli.js — registra la decisión del Agente de Aprovisionamiento.
// Regla de negocio forzada en código: si el riesgo es "alto", SIEMPRE se escala,
// el modelo no puede otorgar el acceso por su cuenta.
// Respeta el ciclo de vida completo: Asignado → En proceso → Resuelto/Escalado.

const { evaluateRisk } = require('../src/riskRules');
const { validarTransicion } = require('../src/ticketEngine');
const { addEntry } = require('../src/bitacora');

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

  const { idTicket, estadoAnterior, tipoAcceso, alcance, rolSolicitado, resumen } = datos;

  try {
    const entradas = [];

    // Paso 1: Asignado → En proceso
    validarTransicion(estadoAnterior, 'En proceso');
    entradas.push(
      addEntry({
        idTicket,
        agente: 'aprovisionamiento',
        estadoAnterior,
        estadoNuevo: 'En proceso',
        resumen: 'Aprovisionamiento inicia la revisión de la solicitud de acceso.',
      })
    );

    // Paso 2: En proceso → Resuelto / Escalado, según el riesgo evaluado
    const riesgo = evaluateRisk({ tipoAcceso, alcance, rolSolicitado });
    const estadoFinal = riesgo === 'alto' ? 'Escalado' : 'Resuelto';

    validarTransicion('En proceso', estadoFinal);

    entradas.push(
      addEntry({
        idTicket,
        agente: 'aprovisionamiento',
        estadoAnterior: 'En proceso',
        estadoNuevo: estadoFinal,
        escaladoA: riesgo === 'alto' ? 'Revisión humana' : null,
        resumen:
          resumen ||
          `Riesgo evaluado: ${riesgo} (tipoAcceso=${tipoAcceso}, alcance=${alcance}, rol=${rolSolicitado}).`,
      })
    );

    console.log(JSON.stringify({ ok: true, idTicket, riesgo, estadoFinal, entradas }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
  }
}

main();
