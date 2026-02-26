/**
 * Start Strapi with TMP/TEMP in project folder (avoids EPERM on Windows).
 * On Windows run: npm run dev:win  (do not use "npm run dev" for uploads)
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const strapiDir = path.resolve(__dirname, '..');
const tmpDir = path.resolve(strapiDir, '.tmp');

fs.mkdirSync(tmpDir, { recursive: true });

const patchPath = path.resolve(strapiDir, 'scripts', 'patch-unlink.js');
const patchPathPosix = patchPath.split(path.sep).join('/');
const env = {
  ...process.env,
  TMP: tmpDir,
  TEMP: tmpDir,
  TMPDIR: tmpDir,
  NODE_OPTIONS: (process.env.NODE_OPTIONS || '') + ` --require ${patchPathPosix}`.trim(),
};

const strapiBin = path.join(strapiDir, 'node_modules', '@strapi', 'strapi', 'bin', 'strapi.js');
const result = spawnSync(process.execPath, ['-r', patchPath, strapiBin, 'develop'], {
  env,
  stdio: 'inherit',
  cwd: strapiDir,
});

process.exit(result.status ?? 1);
