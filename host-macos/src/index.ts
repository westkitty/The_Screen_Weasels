import { WeaselHostServer } from './server.js';

async function main() {
  const server = new WeaselHostServer();
  await server.start();
}

main().catch((err) => {
  console.error('[Host Fatal]', err);
  process.exit(1);
});
