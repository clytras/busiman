import { ipcMain as ipc } from 'electron';


ipc.handle('app.db.config.get', async (event, ...args) => {
  return await process.app.config.get(...args);
});

ipc.handle('app.db.config.set', async (event, ...args) => {
  return await process.app.config.set(...args);
});

ipc.handle('app.db.config.unset', async (event, ...args) => {
  return await process.app.config.unset(...args);
});
