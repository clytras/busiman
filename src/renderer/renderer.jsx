import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import Init from './Init';
import Setup from './Setup';
import App from './App';

// Import the styles here to process them with webpack

if(document.getElementById('init')) {
  ReactDOM.render(<Init/>, document.getElementById('init'));
} else if(document.getElementById('setup')) {
  ReactDOM.render(<Setup/>, document.getElementById('setup'));
} else if(document.getElementById('app')) {
  ReactDOM.render(<App/>, document.getElementById('app'));
}
