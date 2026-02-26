/**
 * On Windows EPERM: pretend unlink succeeded for files in .tmp so Strapi doesn't crash.
 * Sharp keeps file handles open on Windows (esp. GIF) - unlink fails. Load with node -r ./scripts/patch-unlink.js
 */
const fs = require('fs');
const path = require('path');

function isInTmp(filePath) {
  const str = String(filePath);
  const normalized = path.normalize(str).replace(/\\/g, '/');
  return normalized.includes('/.tmp/') || normalized.endsWith('/.tmp');
}

function swallowTempUnlinkError(err, p) {
  return err && (err.code === 'EPERM' || err.code === 'EBUSY') && err.syscall === 'unlink' && isInTmp(p);
}

const unlinkSync = fs.unlinkSync.bind(fs);
fs.unlinkSync = function (p) {
  try {
    return unlinkSync(p);
  } catch (err) {
    if (swallowTempUnlinkError(err, p)) return;
    throw err;
  }
};

const unlink = fs.unlink.bind(fs);
fs.unlink = function (p, callback) {
  if (typeof callback !== 'function') {
    return unlink(p, callback);
  }
  unlink(p, (err) => {
    if (swallowTempUnlinkError(err, p)) return callback();
    callback(err);
  });
};

if (fs.promises && fs.promises.unlink) {
  const unlinkPromise = fs.promises.unlink.bind(fs.promises);
  fs.promises.unlink = function (p) {
    return unlinkPromise(p).catch((err) => {
      if (swallowTempUnlinkError(err, p)) return;
      throw err;
    });
  };
}
