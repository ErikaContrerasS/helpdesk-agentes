// check-servicio.js — recibe el nombre de un servicio, devuelve JSON, nunca se queda colgado
const fs = require('fs');
const path = require('path');

const TIMEOUT_MS = 5000;
const nombreServicio = process.argv[2];

if (!nombreServicio) {
  console.log(JSON.stringify({ ok: false, error: 'Falta el nombre del servicio' }));
  process.exit(1);
}

const timer = setTimeout(() => {
  console.log(JSON.stringify({ ok: false, error: 'Timeout' }));
  process.exit(2);
}, TIMEOUT_MS);

try {
  const data = fs.readFileSync(path.join(__dirname, '../../../data/servicios.json'), 'utf8');
  const servicios = JSON.parse(data);
  const servicioEncontrado = servicios.find(servicio => servicio.nombre === nombreServicio);

  clearTimeout(timer);

  if (servicioEncontrado) {
    console.log(JSON.stringify({ ok: true, ...servicioEncontrado }));
  } else {
    console.log(JSON.stringify({ ok: false, error: 'Servicio no encontrado' }));
  }
} catch (e) {
  clearTimeout(timer);
  console.log(JSON.stringify({ ok: false, error: e.message }));
}
