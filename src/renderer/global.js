import { ipcRenderer as ipc } from 'electron';


if(!process.app) {
  process.app = {
    config: {
      get: (...args) => ipc.invoke('app.db.config.get', ...args),
      set: (...args) => ipc.invoke('app.db.config.set', ...args),
      unset: (...args) => ipc.invoke('app.db.config.unset', ...args)
    }
  }
}
