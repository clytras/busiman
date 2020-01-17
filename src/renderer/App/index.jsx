import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import path from 'path';
import { hot } from 'react-hot-loader/root'
import { makeStyles } from '@material-ui/core/styles';
import { copyStyles } from '@utils/DOM';
import SplitterLayout from 'react-splitter-layout';
import { Titlebar, Color } from '@lytrax/custom-electron-titlebar';
import NewWindow from 'react-new-window'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from '@i18n';
import Header from '@renderer/components/Header';
import Footer from '@renderer/components/Footer';
import SideNav from '@renderer/components/SideNav';
import Button from '@material-ui/core/Button';
import WindowBase from '@renderer/components/WindowBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import * as platform from 'platform';
import { isDevMode, isDbgMode } from '@utils';

import IconButton from '@material-ui/core/IconButton';
import HomeImportOutlineIcon from 'mdi-material-ui/HomeImportOutline';
import DatabaseIcon from 'mdi-material-ui/Database';
import DatabaseCheckIcon from 'mdi-material-ui/DatabaseCheck';
import FileUndoIcon from 'mdi-material-ui/FileUndo';
import FinishedSuccessIcon from 'mdi-material-ui/CheckboxMultipleMarkedCircleOutline';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';



function App() {
  const classes = useStyles();


  useEffect(() => {
    // const titlebar = new Titlebar({
    //   backgroundColor: Color.fromHex('#444444'),
    //   titleHorizontalAlignment: 'left',
    //   drag: true,
    //   menuPosition: 'left',
    //   icon: require('@assets/bsm-icon.png').default
    // });

    // return () => {
    //   titlebar.dispose();
    // }
  }, []);



  return (
    <WindowBase>
      <div className={classes.appContainer}>
        <AppBar position="static" color="primary" className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <div className={classes.grow} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.testContainer}>
          Testing<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          And more...<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          End!<br/>
        </div>
      </div>
    </WindowBase>
  );
}

export default hot(App);


const useStyles = makeStyles({
  appContainer: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
  }
});
