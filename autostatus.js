const fs = require('fs');

let autostatus;

try {
  autostatus = JSON.parse(fs.readFileSync('./autostatus.json'));
} catch (error) {
  autostatus = { autostatus: false };
  fs.writeFileSync('./autostatus.json', JSON.stringify(autostatus, null, 2));
}

async function setAutoStatus(mode) {
  autostatus.autostatus = mode;
  fs.writeFileSync('./autostatus.json', JSON.stringify(autostatus, null, 2));
  return autostatus.autostatus;
}

async function getAutoStatus() {
  return autostatus.autostatus;
}

module.exports = { setAutoStatus, getAutoStatus };