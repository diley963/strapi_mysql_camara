'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  const port = process.env.PORT || 1337;
  let strapiApp = null;

  // 1. Inicializamos la instancia de Strapi 5 en memoria primero
  try {
    const appDir = __dirname;
    const distDir = path.join(__dirname, 'dist');

    strapiApp = await createStrapi({ 
      appDir, 
      distDir 
    });

    // Cargamos Strapi sin levantar un puerto independiente todavía
    await strapiApp.load(); 
    console.log('Instancia interna de Strapi 5 cargada con éxito.');

  } catch (error) {
    console.error('Error crítico al cargar Strapi en memoria:', error);
    process.exit(1);
  }

  // 2. Creamos el servidor único que Hostinger controlará y escuchará
  const server = http.createServer((req, res) => {
    // Redirigimos todas las solicitudes entrantes directamente al manejador de Strapi
    if (strapiApp && strapiApp.server && strapiApp.server.app) {
      return strapiApp.server.app.callback()(req, res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Strapi se está inicializando, por favor refresca en unos segundos...');
    }
  });

  server.listen(port, () => {
    console.log(`¡Strapi 5 está completamente en línea y escuchando en el puerto ${port}!`);
  });
}

main().catch((error) => {
  console.error('Error en el hilo principal:', error);
  process.exit(1);
});