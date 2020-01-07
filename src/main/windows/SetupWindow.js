import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { Window } from './window';
import { selectAppIcon } from '@utils';


export default class SetupWindow extends Window {
  constructor() {
    super({
      icon: selectAppIcon(),
      height: 520,
      width: 680,
      maximizable: false,
      resizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
  }

  create({ force = false } = {}) {
    if(!super.create({ force })) {
      return false;
    }

    this.window = new BrowserWindow(this.browserWindowOptions);
    this.window.loadURL(
      url.format({
        pathname: path.join(__dirname, './setup.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
    this.window.setMenu(null);

    // Emitted when the window is closed.
    this.window.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.window = null;
    });

    // mainWindow.once('ready-to-show', () => {
    //   initWindow && initWindow.close();
    //   mainWindow.show();
    // });
  }
}
