import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ipcRenderer as ipc } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import Init from './Init';
import Setup from './Setup';
import App from './App';
import { Themed } from '@app/globals';



// Import the styles here to process them with webpack

if(document.getElementById('init')) {
  ReactDOM.render(<Init/>, document.getElementById('init'));
} else if(document.getElementById('setup')) {
  (async () => {
    const props = await ipc.invoke('setup:props');
    ReactDOM.render(<Themed><Setup {...props}/></Themed>, document.getElementById('setup'));
  })();
} else if(document.getElementById('app')) {
  ReactDOM.render(<App/>, document.getElementById('app'));
}
