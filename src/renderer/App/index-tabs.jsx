import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import PropTypes from 'prop-types';
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
import * as platform from 'platform';
import { isDevMode, isDbgMode, isMacOS } from '@utils';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography'

import HomeImportOutlineIcon from 'mdi-material-ui/HomeImportOutline';
import DatabaseIcon from 'mdi-material-ui/Database';
import DatabaseCheckIcon from 'mdi-material-ui/DatabaseCheck';
import FileUndoIcon from 'mdi-material-ui/FileUndo';
import FinishedSuccessIcon from 'mdi-material-ui/CheckboxMultipleMarkedCircleOutline';
import AddIcon from '@material-ui/icons/Add';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


import TabBar from '@renderer/components/Navigation/TabBar';


const drawerWidth = 240;

function App() {
  const classes = useStyles();
  const [modalsIndex, setModalsIndex] = useState(0);


  useEffect(() => {
    if(!isMacOS()) {
      const titlebar = new Titlebar({
        backgroundColor: Color.fromHex('#444444'),
        titleHorizontalAlignment: 'center',
        drag: true,
        menuPosition: 'left',
        icon: require('@assets/bsm-icon.png').default
      });
  
      return () => {
        titlebar.dispose();
      }
    }
  }, []);

  function openPopup() {
    //window.open('https://github.com', '_blank', 'nodeIntegration=no')

    const containerEl = document.createElement('div');

    // ReactDOM.render(
    //   <Header/>,
    //   // modal.document.getElementById('hdr')
    //   containerEl
    // );
  
    let modal = window.open(`about:blank?title=${encodeURIComponent('Header test')}`, `modal-${modalsIndex}`, 'width=300,height=250');
    setModalsIndex(modalsIndex + 1);
    
    console.log('modal', modal.global);

  
    // modal.document.write('<div id="hdr"></div>');
    modal.document.body.appendChild(containerEl);
    ReactDOM.render(
      <Header/>,
      // modal.document.getElementById('hdr')
      containerEl
    );

    // const titleEl = document.createElement('title');
    // titleEl.appendChild(document.createTextNode("Hi there and greetings!"));

    // modal.document.head.appendChild(titleEl);

    const ready = () => {
      console.log('modal:DOMContentLoaded');
      copyStyles(document, modal.document);
    }
    // modal.onload((e) => {
    modal.addEventListener("DOMContentLoaded", ready);
    modal.window.addEventListener("DOMContentLoaded", ready);

    // ReactDOM.render(
    //   <Header/>,
    //   modal.document.getElementById('hdr')
    //   // containerEl
    // );

    // setTimeout(() => modal.window.document.title = 'Testing', 3000);

    
    // modal.onload(ready);

    ready();
    
  

    // ReactDOM.createPortal(<Header/>, modal.document.getElementById('hdr'));
    // ReactDOM.createPortal(<Header/>, containerEl);
  }

  const drawer = (
    <div>
      {/* <div className={classes.toolbar} /> */}
      {/* <Divider /> */}
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const tree = (
    <TreeView
      className={classes.root}
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem
          nodeId="5"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          labelInfo="2,294"
          color="#e3742f"
          bgColor="#fcefe3"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          labelInfo="3,566"
          color="#a250f5"
          bgColor="#f3e8fd"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          labelInfo="733"
          color="#3c8039"
          bgColor="#e6f4ea"
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
    </TreeView>
  );

  return (
    <WindowBase>
      <div className={classes.appFrame}>
        <div className={classes.appContainer}>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
              root: classes.drawerRoot
            }}
            variant="permanent"
            open
          >
            {/* {drawer} */}
            {tree}
          </Drawer>
          <div className={classes.testContainer}>
            {/* <AppBar position="static" color="primary" className={classes.appBar}>
              <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="open drawer">
                  <MenuIcon />
                </IconButton>
                <div className={classes.grow} />
                <IconButton color="inherit">
                  <SearchIcon />
                </IconButton>
                <IconButton edge="end" color="inherit">
                  <MoreIcon/>
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <TabBar/>
            <Button variant="contained" onClick={openPopup}>
              Open Popup
            </Button>
            
            {/* <NewWindow // title="Test"
              name={`modal-1234`}
              center="parent"
              copyStyles={true}
              features={{
                width: 300,
                height: 250
              }}
            >
              <Header/>
            </NewWindow> */}
            Testing<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            And more 3...<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            End!<br/>
          </div>
        </div>
        <Footer/>
      </div>
    </WindowBase>
  );
}

export default hot(App);


function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
  appFrame: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    // flexFlow: 'row'
    flexDirection: 'column'
  },
  appContainer: {
    overflow: 'hidden',
    // height: '100%',
    display: 'flex',
    flex: 1,
    // flexFlow: 'row'
    flexDirection: 'row'
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    // marginLeft: drawerWidth,
    width: 'auto'
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    // [theme.breakpoints.up('sm')]: {
    //   width: drawerWidth,
    //   flexShrink: 0,
    // },
  },
  drawerPaper: {
    width: drawerWidth,
    position: 'unset'
  },
  testContainer: {
    flex: 1,
    overflow: 'hidden'
  },

  drawerRoot: {
    flexBasis: drawerWidth,
  },

  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: drawerWidth,
  },
}));

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));
