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

export async function hasGPUEnabled(infoType = 'complete') {
  let result = false;

  try {
    const { gpuDevice = [] } = await app.getGPUInfo(infoType);

    if(gpuDevice && gpuDevice.length) {
      for(let { active } of gpuDevice) {
        console.log('active', active);
        if(result = active) {
          break;
        }
      }
    }
  } catch(error) {}

  return result;
}
