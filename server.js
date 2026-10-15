'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// En Strapi 5, createStrapi se requiere directamente desde el core compilado
const { createStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  // Inicializa la aplicación usando el directorio actual compilado
  const app = await createStrapi();

  await app.start();
}

main().catch((error) => {
  console.error('Error al iniciar Strapi:', error);
  process.exit(1);
});
