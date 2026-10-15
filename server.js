'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  const port = process.env.PORT || 1337;

  // 1. Creamos el servidor puente inmediato para Hostinger
  const dummyServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Strapi levantando servicios...');
  });

  // Escuchamos temporalmente para validar los 3 segundos de Hostinger
  dummyServer.listen(port, () => {
    console.log(`Hostinger detectó el puerto activo ${port}. Iniciando Strapi...`);
  });

  try {
    const appDir = __dirname;
    const distDir = path.join(__dirname, 'dist');

    // 2. Inicializamos la instancia de Strapi 5
    const app = await createStrapi({ 
      appDir, 
      distDir 
    });

    // 3. Cerramos el servidor dummy de forma limpia antes de que Strapi tome el puerto real
    dummyServer.close(async () => {
      console.log('Cediendo el puerto a la instancia real de Strapi.');
      await app.start();
      console.log('¡Strapi 5 está completamente en línea en Hostinger!');
    });

  } catch (error) {
    console.error('Error crítico al iniciar Strapi:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error en el hilo principal:', error);
  process.exit(1);
});