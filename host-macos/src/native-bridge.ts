import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import {
  HandStateSchema,
  type HandState,
} from '@screen-weasels/protocol';

export function startNativeBridge(
  onHandUpdate: (hand: HandState) => void,
): ChildProcess {
  const moduleDir = dirname(fileURLToPath(import.meta.url));

  const bridgePath = resolve(
    moduleDir,
    '../native-bridge/.build/debug/weasel-bridge',
  );

  if (!existsSync(bridgePath)) {
    throw new Error(
      `Native bridge not built: ${bridgePath}`,
    );
  }

  const child = spawn(
    '/usr/bin/script',
    [
      '-q',
      '/dev/null',
      bridgePath,
    ],
    {
      env: {
        ...process.env,
        WEASEL_EDGE:
          process.env.WEASEL_EDGE ?? 'right',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  if (!child.stdout || !child.stderr) {
    throw new Error(
      'Native bridge stdio was not available.',
    );
  }

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  const lines = createInterface({
    input: child.stdout,
  });

  lines.on('line', (rawLine) => {
    const line = rawLine.replace(/\r$/, '');
    const prefix = 'WEASEL_HAND ';

    if (!line.startsWith(prefix)) {
      console.log(`[Native] ${line}`);
      return;
    }

    try {
      const raw = JSON.parse(
        line.slice(prefix.length),
      );

      const parsed =
        HandStateSchema.safeParse(raw);

      if (!parsed.success) {
        console.warn(
          '[Host] Rejected native HAND_UPDATE:',
          parsed.error.message,
        );
        return;
      }

      onHandUpdate(parsed.data);
    } catch (error) {
      console.error(
        '[Host] Failed to parse native hand event:',
        error,
      );
    }
  });

  child.stderr.on('data', (chunk: string) => {
    process.stderr.write(
      `[Native stderr] ${chunk}`,
    );
  });

  child.on('exit', (code, signal) => {
    console.log(
      `[Native] Bridge exited code=${code} signal=${signal}`,
    );
  });

  return child;
}
