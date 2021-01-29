import { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import path from 'path';
import { remote, ipcRenderer as ipc } from 'electron';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { copyStyles } from '@utils/DOM';
import { appTitle } from '@utils';
import { Strings } from '@i18n';
import { normalizeGreek } from 'lyxlib/utils/str';
import bm from '@app/globals';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as platform from 'platform';

import MessageOverlay from '@renderer/components/MessageOverlay';

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
  const [msgtype, setMsgtype] = useState('success');

  useLayoutEffect(() => {
    document.title = appTitle(Strings.titles.Installation);
  }, []);

  useEffect(() => {
    console.log('app.getLocale()', remote.app.getLocale());

    const msgtint = () => {
      console.log('set msgtype', msgtype, msgtype == 'success');

      if(msgtype == 'success') {
        console.log('set warn');
        setMsgtype('warn');
      } else {
        console.log('set success');
        setMsgtype('success');
      }

      setTimeout(msgtint, 2000);
    };

    msgtint();

    // return () => clearInterval(msgtint);
  }, []);

  function handleClose() {
    
  }

  console.log('msgtype render', msgtype);

  return (
    <Fragment>
      <CssBaseline/>
      <div className={classes.container}>
        <header className={classes.header}>
          <img src={require('@assets/Logo_square_XS.png').default} className={classes.logo}/>
          <Typography classes={{ root: classes.title }} variant="h4" component="span" display="inline">
            {Strings.titles.Installation}
          </Typography>
          <MessageOverlay 
            type={msgtype}
            // title="Testing this message 👌" 
            message={`But that doesn't really explain the pros and cons of each. I am looking for an explanation, and possibly a simple example (use case) highlighting those similarities / differences.

Why would one use one over the other?`}/>
        </header>
        <section className={classes.page}></section>
        <footer className={classes.footer}>
          <Button variant="contained" onClick={handleClose}>
            {normalizeGreek(Strings.titles.Previous)}
          </Button>
          <Button variant="contained" onClick={handleClose} color="primary">
            {normalizeGreek(Strings.titles.Next)}
          </Button>
        </footer>
      </div>
    </Fragment>
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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    userSelect: 'none'
  },
  title: {
    color: '#000000ab'
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
