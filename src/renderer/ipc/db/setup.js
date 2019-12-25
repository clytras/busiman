import { ipcRenderer as ipc } from 'electron';


export function setupDBData(...args) {
  return ipc.invoke('setup.db.data', ...args);
}
