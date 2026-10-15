'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  // Forzamos el directorio de trabajo a la raíz del proyecto
  process.chdir(__dirname);

  // 1. Servidor puente inmediato para satisfacer la validación de Hostinger
  const port = process.env.PORT || 1337;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Strapi está iniciando en Hostinger...');
  });

  server.listen(port, async () => {
    console.log(`Servidor de enlace inicial escuchando en el puerto ${port}`);

    try {
      // Definimos las rutas correctas para Strapi 5
      const appDir = __dirname;               // La raíz donde está tu package.json
      const distDir = path.join(__dirname, 'dist'); // Donde el comando 'npm run build' guardó los JS transpilados

      // 2. Inicializamos Strapi con las rutas separadas correctamente
      const app = await createStrapi({ 
        appDir: appDir, 
        distDir: distDir 
      });
      
      // Cerramos el puente HTTP inicial y cedemos el puerto al core de Strapi
      server.close(async () => {
        await app.start();
        console.log('¡Strapi ha iniciado exitosamente en producción en Hostinger!');
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