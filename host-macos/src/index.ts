import { WeaselHostServer } from './server.js';

async function main() {
  const server = new WeaselHostServer();

  const requestedPort = Number.parseInt(
    process.env.WEASEL_PORT ?? '',
    10
  );

  const port = Number.isFinite(requestedPort)
    ? requestedPort
    : undefined;

  await server.start(port);
}

main().catch((err) => {
  console.error('[Host Fatal]', err);
  process.exit(1);
});
