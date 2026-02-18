/**
 * On Windows EPERM: pretend unlink succeeded for files in .tmp so Strapi doesn't crash.
 * Load with node -r ./scripts/patch-unlink.js
 */
const fs = require('fs');
const path = require('path');

function isInTmp(filePath) {
  const normalized = path.normalize(String(filePath));
  return normalized.includes(path.sep + '.tmp' + path.sep) || normalized.endsWith(path.sep + '.tmp');
}

const unlinkSync = fs.unlinkSync.bind(fs);
fs.unlinkSync = function (p) {
  try {
    return unlinkSync(p);
  } catch (err) {
    if (err.code === 'EPERM' && err.syscall === 'unlink' && isInTmp(p)) {
      return;
    }
    throw err;
  }
};

const unlink = fs.unlink.bind(fs);
fs.unlink = function (p, callback) {
  if (typeof callback !== 'function') {
    return unlink(p, callback);
  }
  unlink(p, (err) => {
    if (err && err.code === 'EPERM' && err.syscall === 'unlink' && isInTmp(p)) {
      return callback();
    }
    callback(err);
  });
};
