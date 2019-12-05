import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Init from './Init';

// Import the styles here to process them with webpack

if(document.getElementById('app')) {
  ReactDOM.render(<App/>, document.getElementById('app'));
}

if(document.getElementById('init')) {
  ReactDOM.render(<Init/>, document.getElementById('init'));
}
