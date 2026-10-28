import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, '..');

copyFileSync(
  resolve(rootDir, 'db.backup.json'),
  resolve(rootDir, 'db.json')
);

console.log('Database reset successfully!');