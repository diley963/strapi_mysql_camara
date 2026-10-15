'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  const appDir = __dirname;
  const distDir = path.join(__dirname, 'dist');

  console.log('Inicializando servidor nativo de Strapi 5...');

  // Inicializamos y arrancamos la aplicación de forma directa
  const app = await createStrapi({ 
    appDir, 
    distDir 
  });

  // .start() levantará automáticamente el servidor HTTP interno en process.env.PORT
  await app.start();
  console.log('¡Strapi 5 está escuchando peticiones en las rutas oficiales!');
}

main().catch((error) => {
  console.error('Error crítico en el hilo principal:', error);
  process.exit(1);
});