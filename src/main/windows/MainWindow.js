import path from 'path';
import url from 'url';
import Qs from 'qs';
import { BrowserWindow } from 'electron';
import { Window } from './window';
import { appTitle, selectAppIcon, isMacOS } from '@utils';


export default class MainWindow extends Window {
  constructor() {
    super({
      icon: selectAppIcon(),
      height: 600,
      width: 800,
      // frame: false,
      frame: isMacOS(),
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

        const urlobj = new URL(url);
        const params = Qs.parse(urlobj.search);

        console.log('new-window', url, frameName, options, additionalFeatures, event, disposition);
        console.log('new-window:url', urlobj.search, urlobj.searchParams, params);

        event.preventDefault();
        Object.assign(options, {
          // modal: true,
          title: appTitle(urlobj.searchParams.get('title')),
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
        // event.newGuest.on('page-title-updated', (evt, ...rest) => {
        //   console.log(frameName, 'page-title-updated', evt, rest);
        //   evt.preventDefault();
        // });
        event.newGuest.on('closed', () => {
          console.log('new-window:closed', frameName, url);
          delete this.popups[frameName];
        });

        // this.popups.push(event.newGuest);
        this.popups[frameName] = event.newGuest;
      }
    });

    // mainWindow.once('ready-to-show', () => {
    //   initWindow && initWindow.close();
    //   mainWindow.show();
    // });

    // this.window.on('browser-window-focus', (event) => {
    //   console.log('Got browser-window-focus');
    // });

    // this.window.on('focus',() => {
    //   // if(child!=null && child.isVisible()){
    //   //   child.focus()
    //   // }

    //   console.log('Got focus');

    //   // popups.forEach((popup, index) => {
    //   //   popup.show();
    //   // });
    // });
  }
}
