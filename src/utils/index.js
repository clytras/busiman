import os from 'os';
import path from 'path';
import { app, remote } from 'electron';

const isRenderer = require('is-electron-renderer');

export function selectAppIcon() {
  switch(os.platform()) {
    case 'win32': return require('@assets/BusinessMan_Win.ico').default;
    // case 'win32': return path.resolve(__dirname, '../../assets/BusinessMan_Win.ico');
    case 'darwin': return require('@assets/BusinessMan_Mac.icns').default;
    // case 'darwin': return path.resolve(__dirname, '../../assets/BusinessMan_Mac.icns');
    default: return require('@assets/BusinessMan_Linux.png').default;
  }
}

export function appTitle(...parts) {
  return [(isRenderer ? remote.app : app).name, ...parts].join(' - ');
}

export function isDevMode() {
  return (isRenderer ? remote.process : process).argv.indexOf('--dev') !== -1;
}

export function isDbgMode() {
  return (isRenderer ? remote.process : process).argv.indexOf('--dbg') !== -1;
}

export const isWindows = () => os.platform() === 'win32';
export const isMacOS = () => os.platform() === 'darwin';
export const isLinux = () => os.platform() === 'linux';

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
