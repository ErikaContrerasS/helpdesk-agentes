#!/usr/bin/env node
// diagnostico-cli.js — registra la decisión del Agente de Diagnóstico técnico.
// Regla de negocio forzada en código (no en el criterio del modelo):
// si el servicio está "degradado" o "caído", SIEMPRE se escala, nunca se resuelve.
// Respeta el ciclo de vida completo: Asignado → En proceso → Resuelto/Escalado.

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

  const {
    idTicket,
    estadoAnterior, // normalmente "Asignado"
    accionDeterministica = false, // ej. reseteo de contraseña
    estadoServicio = null, // 'operativo' | 'degradado' | 'caído', si se usó la skill
    escaladoA = null,
    resumen,
  } = datos;

  try {
    const entradas = [];

    // Paso 1: Asignado → En proceso (el agente inicia el trabajo)
    validarTransicion(estadoAnterior, 'En proceso');
    entradas.push(
      addEntry({
        idTicket,
        agente: 'diagnostico-tecnico',
        estadoAnterior,
        estadoNuevo: 'En proceso',
        resumen: 'Diagnóstico técnico inicia el trabajo del ticket.',
      })
    );

    // Paso 2: En proceso → Resuelto / Escalado, según el resultado
    let estadoFinal;
    if (accionDeterministica) {
      estadoFinal = 'Resuelto';
    } else if (estadoServicio === 'operativo') {
      estadoFinal = 'Resuelto';
    } else if (estadoServicio === 'degradado' || estadoServicio === 'caído') {
      estadoFinal = 'Escalado'; // forzado por código, no por decisión del modelo
    } else {
      console.log(JSON.stringify({ ok: false, error: 'No se indicó accionDeterministica ni estadoServicio válido' }));
      process.exit(1);
      return;
    }

    validarTransicion('En proceso', estadoFinal);

    entradas.push(
      addEntry({
        idTicket,
        agente: 'diagnostico-tecnico',
        estadoAnterior: 'En proceso',
        estadoNuevo: estadoFinal,
        escaladoA: estadoFinal === 'Escalado' ? (escaladoA || 'Infraestructura / NOC') : null,
        resumen: resumen || `Resultado: ${accionDeterministica ? 'acción determinística aplicada' : 'estado del servicio ' + estadoServicio}.`,
      })
    );

    console.log(JSON.stringify({ ok: true, idTicket, estadoFinal, entradas }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
  }
}

main();
