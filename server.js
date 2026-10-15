'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  process.chdir(__dirname);

  const appContext = await compileStrapi();
  const app = createStrapi(appContext);

  await app.start();
}

main().catch((error) => {
  console.error('Error al iniciar Strapi:', error);
  process.exit(1);
});
