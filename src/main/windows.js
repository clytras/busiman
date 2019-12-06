import { BrowserWindow } from 'electron';
//import { enableLiveReload } from 'electron-compile';
import util from 'util';
import path from 'path';
import url from 'url';
import { selectAppIcon } from '../utils';


class Window {
  window = null;
  popups = [];

  constructor(browserWindowOptions, options) {
    this.browserWindowOptions = browserWindowOptions || {};
    this.options = options || {};
  }

  create({ forse = false } = {}) {
    if(this.window !== null) {
      if(!forse) {
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
  }

  show() {
    if(this.window) {
      this.window.show();
    }
  }

  close() {
    if(this.window) {
      this.window.close();
    }
  }

  on(event, callback) {
    if(this.window) {
      this.window.on(event, callback);
    }
  }

  once(event, callback) {
    if(this.window) {
      this.window.once(event, callback);
    }
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
        pathname: path.join(__dirname, './index.html'),
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

    this.browserWindowOptions.transparent = process.config.appHasGPU;
    console.log('process.env.APP_HASGPU', process.env.APP_HASGPU);
    console.log('this.browserWindowOptions.transparent', this.browserWindowOptions.transparent);
    console.log('this.browserWindowOptions', util.inspect(this.browserWindowOptions));

    
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

// export function createMainWindow() {
//   let popups = [];

//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     //icon: path.resolve(path.join(__dirname, '../assets/BusinessMan_Win.ico')),
//     icon: selectAppIcon(),
//     height: 600,
//     width: 800,
//     frame: false,
//     show: false,
//     webPreferences: {
//       nativeWindowOpen: true,
//       nodeIntegration: true
//     }
//   });

//   // and load the index.html of the app.
//   console.log(path.resolve(path.join(__dirname, '../assets/BusinessMan_Win.ico')));
//   console.log('selectAppIcon', selectAppIcon());
//   console.log('process.cwd()', process.cwd());


//   mainWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname, './index.html'),
//       protocol: 'file:',
//       slashes: true,
//     })
//   );

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools();

//   // Emitted when the window is closed.
//   mainWindow.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null;
//   });

//   mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
//     if (frameName.substring(0, 5) == 'modal') {
//       // open window as modal
//       event.preventDefault()
//       Object.assign(options, {
//         // modal: true,
//         modal: false,
//         parent: mainWindow,
//         //width: 100,
//         //height: 100,
//         frame: true,
//         webPreferences: {
//           nodeIntegration: true,
//           // preload: path.join(__dirname, '../rendered/preload.js')
//         }
//       })
//       event.newGuest = new BrowserWindow(options);
//       event.newGuest.setMenu(null);
//       event.newGuest.webContents.openDevTools();

//       popups.push(event.newGuest);
//     }
//   });

//   mainWindow.once('ready-to-show', () => {
//     initWindow && initWindow.close();
//     mainWindow.show();
//   });

//   mainWindow.on('browser-window-focus', (event) => {
//     console.log('Got browser-window-focus');
//   });

//   mainWindow.on('focus',function(){
//     //if(child!=null && child.isVisible()){
//     //    child.focus()
//     //}

//     console.log('Got focus');

//     /*popups.forEach((popup, index) => {
//       popup.show();
//     });*/
//   });

//   return mainWindow;
// }

// export function createInitWindow() {
//   const initWindow = new BrowserWindow({
//     icon: selectAppIcon(),
//     height: 300,
//     width: 650,
//     center: true,
//     transparent: true,
//     frame: false,
//     webPreferences: {
//       // nativeWindowOpen: true,
//       nodeIntegration: true
//     }
//   });

//   //console.log('init.html', require('file-loader!../renderer/init.html').default);

//   //console.log('init.html 2', require('../renderer/init.html').default);

//   initWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname, './init.html'),
//       protocol: 'file:',
//       slashes: true,
//     })
//   );

//   // Open the DevTools.
//   // initWindow.webContents.openDevTools();

//   // Emitted when the window is closed.
//   initWindow.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     console.log('Init window closed');
//     initWindow = null;
//   });

//   return initWindow;
// }
