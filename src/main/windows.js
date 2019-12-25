import { BrowserWindow } from 'electron';
//import { enableLiveReload } from 'electron-compile';
import util from 'util';
import path from 'path';
import url from 'url';
import { selectAppIcon, isDevMode, appTitle } from '@utils';
import { Strings } from 'i18n';


class Window {
  window = null;
  popups = [];

  constructor(browserWindowOptions, options) {
    this.browserWindowOptions = browserWindowOptions || {};
    this.options = options || {};
  }

  create({ force = false } = {}) {
    if(this.window !== null) {
      if(!force) {
        return false;
      }
      this.window.close();
    }
    return true;
  }

  get hasWindow() {
    return this.window !== null;
  }

  restoreFocus() {
    if(this.window) {
      if(this.window.isMinimized()) this.window.restore()
      this.window.focus()
    }
    return this;
  }

  show() {
    if(this.window) {
      this.window.show();
    }
    return this;
  }

  close() {
    if(this.window) {
      this.window.close();
    }
    return this;
  }

  openDevTools() {
    if(this.window && isDevMode()) {
      this.window.webContents.openDevTools();
    }
    return this;
  }

  on(event, callback) {
    if(this.window) {
      this.window.on(event, callback);
    }
    return this;
  }

  once(event, callback) {
    if(this.window) {
      this.window.once(event, callback);
    }
    return this;
  }

  send(event, ...args) {
    if(this.window) {
      this.window.webContents.send(event, ...args)
    }
    return this;
  }
}

export class MainWindow extends Window {
  constructor() {
    super({
      icon: selectAppIcon(),
      height: 600,
      width: 800,
      frame: false,
      show: false,
      webPreferences: {
        nativeWindowOpen: true,
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
        pathname: path.join(__dirname, './app.html'),
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

    this.window.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName.substring(0, 5) == 'modal') {
        // open window as modal
        event.preventDefault()
        Object.assign(options, {
          // modal: true,
          modal: false,
          parent: this.window,
          //width: 100,
          //height: 100,
          frame: true,
          webPreferences: {
            nodeIntegration: true,
          }
        })
        event.newGuest = new BrowserWindow(options);
        event.newGuest.setMenu(null);
        event.newGuest.webContents.openDevTools();

        this.popups.push(event.newGuest);
      }
    });

    // mainWindow.once('ready-to-show', () => {
    //   initWindow && initWindow.close();
    //   mainWindow.show();
    // });

    // this.window.on('browser-window-focus', (event) => {
    //   console.log('Got browser-window-focus');
    // });

    this.window.on('focus',() => {
      // if(child!=null && child.isVisible()){
      //   child.focus()
      // }

      console.log('Got focus');

      // popups.forEach((popup, index) => {
      //   popup.show();
      // });
    });
  }
}

export class InitWindow extends Window {
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
      console.log('Init window closed');
      this.window = null;
    });
  }
}

export class SetupWindow extends Window {
  constructor() {
    super({
      icon: selectAppIcon(),
      // title: appTitle(Strings.titles.Installation),
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
