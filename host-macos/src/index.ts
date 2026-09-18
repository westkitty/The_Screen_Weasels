import { WeaselHostServer } from './server.js';
import { startNativeBridge } from './native-bridge.js';

async function main() {
  const server = new WeaselHostServer();

  const requestedPort = Number.parseInt(
    process.env.WEASEL_PORT ?? '',
    10,
  );

  const port = Number.isFinite(requestedPort)
    ? requestedPort
    : undefined;

  await server.start(port);

  const bridge = startNativeBridge((hand) => {
    server.publishHand(hand);

    console.log(
      `[Host] HAND_UPDATE -> shells ` +
      `active=${hand.active} ` +
      `x=${hand.x.toFixed(1)} ` +
      `y=${hand.y.toFixed(1)}`,
    );
  });

  const shutdown = () => {
    if (!bridge.killed) {
      bridge.kill('SIGTERM');
    }

    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[Host Fatal]', err);
  process.exit(1);
});
