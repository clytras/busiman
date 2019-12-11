import React, { useState, useEffect, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import path from 'path';
import { remote, ipcRenderer as ipc } from 'electron';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { copyStyles } from '@utils/DOM';
import { appTitle } from '@utils';
import { Strings } from '@i18n';
import bm from '@app/globals';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as platform from 'platform';


import '@assets/fonts/MaterialDesignIcons/material-icons.css';
import '@assets/fonts/Roboto/index.css';
import '@renderer/styles.scss';


// window.addEventListener('load', () => {
//   setTimeout(() => {
//     ipc.send('init:done');
//   }, 1000);
// });

function Setup({
  appInit: {
    internal
  }
}) {
  const classes = useStyles();

  useLayoutEffect(() => {
    document.title = appTitle(Strings.titles.Installation);
  }, []);

  useEffect(() => {
    
  }, []);

  function handleClose() {
    
  }

  return (
    <React.Fragment>
      <CssBaseline/>
      <div className={classes.container}>
        <header className={classes.header}>
          <img src={require('@assets/Logo_square_XS.png').default} className={classes.logo}/>
          <Typography variant="h4" component="span" display="inline">
            {Strings.titles.Installation}
          </Typography>
        </header>
        <section className={classes.page}></section>
        <footer className={classes.footer}>
          <Button variant="contained" onClick={handleClose}>
            {Strings.titles.Previous}
          </Button>
          <Button variant="contained" onClick={handleClose} color="primary">
            {Strings.titles.Next}
          </Button>
        </footer>
      </div>
    </React.Fragment>
  );
}

export default hot(Setup);

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'visible'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 170,
    margin: '6px 5vw'
  },

  page: {
    flex: 1,
    backgroundColor: bm.colors.wizardPanel
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: theme.spacing(1),
    '& > button': {
      marginLeft: theme.spacing(1)
    }
  }
}));
