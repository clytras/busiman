import path from 'path';
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { ipcRenderer as ipc } from 'electron';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { copyStyles } from '../utils/DOM';
import LogoLoader from './components/LogoLoader';

import {Strings} from '@i18n';
import Button from '@material-ui/core/Button';
import * as platform from 'platform';


import '../../assets/fonts/MaterialDesignIcons/material-icons.css';
import '../../assets/fonts/Roboto/index.css';
import 'react-splitter-layout/lib/index.css';
import './styles.scss';


// window.addEventListener('load', () => {
//   setTimeout(() => {
//     ipc.send('init:done');
//   }, 1000);
// });

export default function() {
  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      ipc.send('init:done');
    }, 1000);
  }, []);

  return (
    <React.Fragment>
      <CssBaseline/>
      <div className={classes.initContainer}>
        <LogoLoader useLogo={true} width={68} height={68}/>
      </div>
    </React.Fragment>
  );
}


const useStyles = makeStyles({
  initContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'visible'
  },
});
