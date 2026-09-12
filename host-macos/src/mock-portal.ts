import { WeaselHostServer } from './server.js';

async function runMockPortal() {
  console.log('[Mock Portal] Starting Screen Weasels Host in Mock Portal mode...');
  const server = new WeaselHostServer();
  await server.start();

  console.log('[Mock Portal] Simulating cursor portal crossing into Screen Weasel A in 2 seconds...');

  setTimeout(() => {
    console.log('[Mock Portal] Hand ENTERING Shell A (Edge Glow ON)');
    server.broadcast('HAND_UPDATE', {
      active: true,
      shellId: 'shell_a',
      x: 10,
      y: 120,
      vx: 120,
      vy: 0,
      clicked: false,
      edgeGlow: 1.0,
    });

    let currentX = 10;
    const interval = setInterval(() => {
      currentX += 15;
      if (currentX > 200) {
        clearInterval(interval);
        console.log('[Mock Portal] Hand EXITING Shell A (Edge Glow OFF)');
        server.broadcast('HAND_UPDATE', {
          active: false,
          shellId: 'none',
          x: currentX,
          y: 120,
          vx: 0,
          vy: 0,
          clicked: false,
          edgeGlow: 0,
        });
      } else {
        server.broadcast('HAND_UPDATE', {
          active: true,
          shellId: 'shell_a',
          x: currentX,
          y: 120,
          vx: 150,
          vy: 0,
          clicked: false,
          edgeGlow: 0.8,
        });
      }
    }, 100);
  }, 2000);
}

runMockPortal().catch(console.error);
