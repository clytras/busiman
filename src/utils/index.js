import os from 'os';
import { app, remote } from 'electron';
const isRenderer = require('is-electron-renderer');

export function selectAppIcon() {
  switch(os.platform()) {
    case 'win32': return require('../../assets/BusinessMan_Win.ico').default;
    case 'darwin': return require('../../assets/BusinessMan_Mac.icns').default;
    default: return require('../../assets/BusinessMan_Linux.png').default;
  }
}

export function isDevMode() {
  return (isRenderer ? remote.process : process).argv.indexOf('--dev') !== -1;
}

export function isDbgMode() {
  return (isRenderer ? remote.process : process).argv.indexOf('--dbg') !== -1;
}

import util from 'util';
export async function hasGPUEnabled(infoType = 'basic') {
  let result = false;

  try {
    const { gpuDevice = [] } = await app.getGPUInfo(infoType);

    if(gpuDevice && gpuDevice.length) {
      for(let { deviceId, vendorId } of gpuDevice) {
        if(result = (deviceId !== 0 && vendorId !== 0)) {
          break;
        }
      }
    }
  } catch(error) {}

  console.log('hasGPUEnabled:result', util.inspect(result));

  return result;
}
