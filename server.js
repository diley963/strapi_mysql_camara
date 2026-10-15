'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  // Aseguramos que el proceso use la raíz del proyecto
  process.chdir(__dirname);

  // 1. Servidor puente inmediato para Hostinger
  const port = process.env.PORT || 1337;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Strapi está iniciando en producción...');
  });

  server.listen(port, async () => {
    console.log(`Servidor de enlace inicial escuchando en el puerto ${port}`);

    try {
      // 2. Apuntamos a la carpeta 'dist' generada por el comando "npm run build"
      const distDir = path.join(__dirname, 'dist');

      // Inicializamos Strapi obligándolo a leer el código compilado JS
      const app = await createStrapi({ 
        appDir: distDir, 
        distDir: distDir 
      });
      
      // Cerramos el puente e iniciamos el CMS
      server.close(async () => {
        await app.start();
        console.log('¡Strapi ha iniciado exitosamente en producción!');
      });

    } catch (error) {
      console.error('Error fatal al iniciar Strapi:', error);
      process.exit(1);
    }
  });
}

main().catch((error) => {
  console.error('Error en la función principal:', error);
  process.exit(1);
});