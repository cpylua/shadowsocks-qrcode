'use strict';

const qrcode = require('qrcode-terminal');
const path = require('path');

// https://shadowsocks.org/en/config/quick-guide.html
function encodeToShadowsocksURI(config) {
  return `${config.method}${config.auth ? '-auth' : ''}:${config.password}@${config.server}:${config.server_port}`;
}

function encodeToBase64(str) {
  return `ss://${new Buffer(str).toString('base64')}`;
}

function readShadowsocksConfig(filepath) {
  return require(path.resolve(filepath));
}

function drawQRCode(str) {
  qrcode.generate(str);
}

function pipe() {
  const fns = arguments;
  return function (input) {
    for (let i = 0; i < fns.length; i++) {
      input = fns[i](input);
    }
  }
}

function main() {
  const configs = process.argv.slice(2);
  if (configs.length === 0) {
    console.error('usage: node index.js path-to-shaodowsocks-json-config-file...');
    process.exit(1);
  }

  const pipeline = pipe(
    readShadowsocksConfig,
    encodeToShadowsocksURI,
    encodeToBase64,
    drawQRCode
  );

  configs.forEach(pipeline);
}

main();
