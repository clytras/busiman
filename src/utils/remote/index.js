import { remote } from 'electron';

export function isDevMode() {
  return remote.process.argv.indexOf('--dev') !== -1;
}

export function isDbgMode() {
  return remote.process.argv.indexOf('--dbg') !== -1;
}
