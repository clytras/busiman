import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { Window } from './window';
import { selectAppIcon } from '@utils';


export default class InitWindow extends Window {
  constructor() {
    super({
      icon: selectAppIcon(),
      height: 160,
      width: 300,
      center: true,
      transparent: true,
      frame: false,
      webPreferences: {
        // nativeWindowOpen: true,
        nodeIntegration: true
      }
    });
  }

  create({ force } = {}) {
    if(!super.create({ force })) {
      return false;
    }

    // this.browserWindowOptions.transparent = process.app.system.hasGPU;
    this.window = new BrowserWindow(this.browserWindowOptions);
    this.window.loadURL(
      url.format({
        pathname: path.join(__dirname, './init.html'),
        protocol: 'file:',
        slashes: true,
      })
    );

    // Emitted when the window is closed.
    this.window.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.window = null;
    });
  }
}
