

import { app, BrowserWindow, ipcMain as ipc } from 'electron';
//import { enableLiveReload } from 'electron-compile';
import path from 'path';
import url from 'url';
import { selectAppIcon } from '../utils';

import { InitWindow, MainWindow } from './windows';

//require('electron-reload')(__dirname)



/*nodemon.on('start', function () {
  console.log('App has started');
}).on('quit', function () {
  console.log('App has quit');
  process.exit();
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});*/

let mainWindow, initWindow;

console.log(`__dirname: ${__dirname}`);

// let watchInterval = (new Date).getTime();

// fs.watch(`${__dirname}`, function(event, targetfile){


//   if(((new Date).getTime() - watchInterval) > 500) {
//     mainWindow.reload();
//   }


//   console.log('watch', targetfile);
//   /*if(targetfile != null && event == 'rename'){
//     console.log( targetfile, 'is', event);
//     fs.stat(targetfile, function(err, stats) {
//        console.log(stats);
//     });
//   }*/
// });

// const isDevMode = process.execPath.match(/[\\/]electron/);

//if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

/*if (process.env.NODE_ENV === 'development') {
  const electronHot = require('electron-hot-loader');
  electronHot.install();
  electronHot.watchJsx(['../renderer/*.jsx']);
  electronHot.watchCss(['../renderer/*.scss']);
}*/


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  const initWindow = new InitWindow();
  const mainWindow = new MainWindow();

  ipc.on('init:done', () => {
    console.log('got init:done');
    mainWindow.create();
    mainWindow.once('ready-to-show', () => {
      initWindow.close();
      mainWindow.show();
    });
  });

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    // if (myWindow) {
    //   if (myWindow.isMinimized()) myWindow.restore()
    //   myWindow.focus()
    // }
    mainWindow.restoreFocus();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', function() {
    // app.on('browser-window-created',function(e,window) {
    //   window.setMenu(null);
    // });

    // createWindow();
    // createInitWindow();
    initWindow.create();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      // createWindow();
      mainWindow.create();
      mainWindow.show();
    }
  });
}





// function createWindow() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
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
// }

// function createInitWindow() {
//   initWindow = new BrowserWindow({
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

// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', function() {
//   // app.on('browser-window-created',function(e,window) {
//   //   window.setMenu(null);
//   // });

//   // createWindow();
//   createInitWindow();
// });

// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On OS X it"s common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
