'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  const port = process.env.PORT || 1337;
  let strapiApp = null;
  let isStrapiReady = false;

  // 1. Creamos y levantamos el servidor HTTP INMEDIATAMENTE
  const server = http.createServer((req, res) => {
    // Si Strapi ya cargó por completo en segundo plano, le pasamos el control
    if (isStrapiReady && strapiApp && strapiApp.server && strapiApp.server.app) {
      return strapiApp.server.app.callback()(req, res);
    } else {
      // Mientras carga, el servidor responde con éxito para que Hostinger no tire un error
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Strapi 5 se está inicializando en Hostinger, por favor refresca en unos segundos...');
    }
  });

  // LLAMADA INMEDIATA: Ejecuta listen() en menos de 10ms superando los 3 segundos de Hostinger
  server.listen(port, () => {
    console.log(`Servidor HTTP activo en el puerto ${port}. Cargando Strapi de fondo de inmediato...`);
    
    // 2. Cargamos Strapi en segundo plano de forma segura sin bloquear el inicio
    (async () => {
      try {
        const appDir = __dirname;
        const distDir = path.join(__dirname, 'dist');

        strapiApp = await createStrapi({ 
          appDir, 
          distDir 
        });

        await strapiApp.load(); 
        isStrapiReady = true;
        console.log('¡Instancia de Strapi 5 cargada con éxito y lista para recibir tráfico!');
      } catch (error) {
        console.error('Error crítico al cargar Strapi de fondo:', error);
        process.exit(1);
      }
    })();
  });
}

main().catch((error) => {
  console.error('Error en el hilo principal:', error);
  process.exit(1);
});