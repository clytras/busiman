import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig } from 'react-hot-loader'

// https://github.com/gaearon/react-hot-loader/issues/1088#issuecomment-440820031
setConfig({
  // if our patch is present - ignore all SFC
  ignoreSFC: !!ReactDOM.setHotElementComparator,
  // set this flag to support SFC if patch is not landed
  pureSFC: true,
  // remove side effect on classes, to make react-dev-tools experience better(go-to-source)
  pureRender: true,
});

import './global';
import { ipcRenderer as ipc } from 'electron';
import Init from './Init';
import Setup from './Setup';
import App from './App';
import { Themed } from '@utils/theme';
import { setupContextMenus } from './menus';


setupContextMenus();

// Import the styles here to process them with webpack

if(document.getElementById('init')) {
  ReactDOM.render(<Init/>, document.getElementById('init'));
} else if(document.getElementById('setup')) {
  (async () => {
    const props = await ipc.invoke('setup:props');
    ReactDOM.render(<Themed><Setup {...props}/></Themed>, document.getElementById('setup'));
  })();
} else if(document.getElementById('app')) {
  ReactDOM.render(<Themed><App/></Themed>, document.getElementById('app'));
}
