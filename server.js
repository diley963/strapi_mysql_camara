'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  // 1. Creamos un servidor HTTP nativo inmediato para que Hostinger detecte listen() antes de los 3 segundos
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Strapi está iniciando...');
  });

  // Hostinger inyecta el puerto dinámico en process.env.PORT
  const port = process.env.PORT || 1337;

  server.listen(port, async () => {
    console.log(`Servidor de enlace inicial escuchando en el puerto ${port}`);

    try {
      // 2. Inicializamos Strapi de forma segura
      const app = await createStrapi();
      
      // Cerramos el servidor temporal para liberar el puerto antes de que Strapi tome el control
      server.close(async () => {
        // 3. Arrancamos Strapi en el puerto asignado por Hostinger
        await app.start();
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
