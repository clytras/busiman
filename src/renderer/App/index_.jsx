import path from 'path';
import React from 'react'
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root'
// import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { copyStyles } from '@utils/DOM';
import SplitterLayout from 'react-splitter-layout';
import { Titlebar, Color } from '@lytrax/custom-electron-titlebar';
import WindowBase from '@renderer/components/WindowBase';
import NewWindow from 'react-new-window'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from '@i18n';
import Header from '@renderer/components/Header';
import Footer from '@renderer/components/Footer';
import SideNav from '@renderer/components/SideNav';
import Button from '@material-ui/core/Button';

import * as platform from 'platform';
import { isDevMode, isDbgMode } from '@utils';


import IconButton from '@material-ui/core/IconButton';
import HomeImportOutlineIcon from 'mdi-material-ui/HomeImportOutline';
import DatabaseIcon from 'mdi-material-ui/Database';
import DatabaseCheckIcon from 'mdi-material-ui/DatabaseCheck';
import FileUndoIcon from 'mdi-material-ui/FileUndo';
import FinishedSuccessIcon from 'mdi-material-ui/CheckboxMultipleMarkedCircleOutline';

const app = require('electron').remote.app


// import {library} from '@fortawesome/fontawesome-svg-core'
// import {
//   faTimes, 
//   faSearchMinus, 
//   faSearchPlus, 
//   faMapMarkerAlt,
//   faHandPointLeft,
//   faHome
// } from '@fortawesome/free-solid-svg-icons';

/* Font Awesome Icons */
// library.add(
//   faTimes,
//   faSearchMinus,
//   faSearchPlus,
//   faMapMarkerAlt,
//   faHandPointLeft,
//   faHome
// );

// import 'bootstrap/dist/css/bootstrap.css';
// import 'typeface-roboto/index.css';

// import '@assets/fonts/MaterialDesignIcons/material-icons.css';
// import '@assets/fonts/Roboto/index.css';
import 'react-splitter-layout/lib/index.css';
// import '@renderer/styles.scss';

// const App = () => (
//     <div>
//         <h4>Welcome to React, Electron and JS!!</h4>
//         <NewWindow title="Test">
//             <h1>Hi 👋</h1>
//         </NewWindow>
//     </div>
// )


class App extends React.Component {
  // const classes = useStyles();
  // const [modalsIndex, setModalsIndex] = useState(0);

  // useEffect(() => {
  //   new Titlebar({
  //     backgroundColor: Color.fromHex('#444444'),
  //     titleHorizontalAlignment: 'left',
  //     drag: true,
  //     menuPosition: 'left',
  //     icon: require('../../assets/bsm-icon.png').default
  //   });
  // }, []);

  state = {
    modalsIndex: 0,
    Icon: HomeImportOutlineIcon,
    icon: 0
  }

  constructor(props) {
    super(props);

    this.openPopup = this.openPopup.bind(this);
    this.toggleIcon = this.toggleIcon.bind(this);
  }

  componentDidMount() {
    new Titlebar({
      backgroundColor: Color.fromHex('#444444'),
      titleHorizontalAlignment: 'left',
      drag: true,
      menuPosition: 'left',
      icon: require('@assets/bsm-icon.png').default
    });

    // let icon = 1;
    // setInterval(() => {
    //   if(icon & 1) {
    //     this.setState({ Icon: HomeImportOutlineIcon });
    //     icon = 0;
    //   } else {
    //     this.setState({ Icon: FileUndoIcon });
    //     icon = 1;
    //   }
    // }, 1000);
  }

  toggleIcon() {
    let { Icon, icon } = this.state;

    if(icon & 1) {
      Icon = HomeImportOutlineIcon;
      icon = 0;
    } else {
      Icon = FileUndoIcon;
      icon = 1;
    }

    this.setState({ Icon, icon });
  }


  openPopup() {
    //window.open('https://github.com', '_blank', 'nodeIntegration=no')

    let { modalsIndex  } = this.state;

    // const nextModalIndex = modalsIndex + 1;
    let modal = window.open('', `modal-${++modalsIndex}`, 'width=300,height=250');
    //setModalsIndex(nextModalIndex);
    this.setState({ modalsIndex });

    modal.document.write('<div id="hdr"></div>')
    copyStyles(document, modal.document);

    ReactDOM.render(
      <Header/>,
      modal.document.getElementById('hdr')
    );
  }

  render() {
    const { classes } = this.props;
    const { Icon } = this.state;

    return (
      <WindowBase>
        <div className={classes.appContainer}>
          <Header/>
          <div className={classes.contentFrameContainer}>
            <SplitterLayout className={classes.sidebarSplitter}
              percentage
              primaryMinSize={15}
              secondaryInitialSize={75}
            >
            <SideNav/>
            <div>
              <h4>Welcome to React, Electron and JS!!! {Strings.Home}</h4>
              <pre>{
              [platform.name,
              platform.version,
              platform.product,
              platform.manufacturer,
              platform.layout,
              platform.os,
              platform.description].join("\n")
              }</pre>
              <pre>
                Dev mode: {isDevMode() ? 'yes' : 'no'}{"\n"}
                Dbg mode: {isDbgMode() ? 'yes' : 'no'}{"\n"}
                appPath: {`${app.getAppPath()}\n`}
                path:appData: {`${app.getPath('appData')}\n`}
                path:userData: {`${app.getPath('userData')}\n`}
                path:exe: {`${app.getPath('exe')}\n`}
                path:module: {`${app.getPath('module')}\n`}
              </pre>
            
              <Button variant="contained" color="primary" onClick={this.openPopup}>{"Open Modal!!"}</Button>
              <IconButton onClick={() => {}}>
                <Icon/>
              </IconButton>
              <IconButton onClick={this.toggleIcon}>
                <FinishedSuccessIcon/>
              </IconButton>
              {/* <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
              <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
              </Modal> */}
            
            </div>
            </SplitterLayout>
          </div>
          <Footer/>
        </div>
      </WindowBase>
    );
  }
}

// class App extends React.Component {
//   constructor(props) {
//   super(props);
//   this.state = {
//     modal: false,
//     modalsIndex: 0
//   };

//   this.toggle = this.toggle.bind(this);
//   this.openPopup = this.openPopup.bind(this);
//   }

//   componentWillMount() {
//   document.body.classList.add(`platform-${process.platform}`);
//   }
  
//   toggle() {
//   this.setState({
//     modal: !this.state.modal
//   });
//   }



//   openPopup() {
//   //window.open('https://github.com', '_blank', 'nodeIntegration=no')

//   let modal = window.open('', `modal-${this.state.modalsIndex++}`, 'width=300,height=250')
  

//   modal.document.write('<div id="hdr"></div>')
//   copyStyles(document, modal.document);

//   ReactDOM.render(
//     <Header/>,
//     modal.document.getElementById('hdr')
//   );
//   }
  
//   render() {
//   //window.open('https://github.com', '_blank', 'nodeIntegration=no')

//   /*                <NewWindow title="Test" name="MyWindow">
//       <h1>Hi 👋</h1>
//     </NewWindow> */

//   return (
//     <div className={css(styles.appContainer)}>
//     <Header/>
//     <div className={css(styles.contentFrameContainer)}>
//       <SplitterLayout className={css(styles.sidebarSplitter)}
//         percentage
//         primaryMinSize={15}
//         secondaryInitialSize={75}
//       >
//       <SideNav/>
//       <div>
//         <h4>Welcome to React, Electron and JS!!!! {Strings.Home}</h4>
//         <pre>{
//         [platform.name,
//         platform.version,
//         platform.product,
//         platform.manufacturer,
//         platform.layout,
//         platform.os,
//         platform.description].join("\n")
//         }</pre>
      
//         <Button variant="contained" color="primary" onClick={this.openPopup}>{"Open Modal!!"}</Button>
//         {/* <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
//         <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
//         <ModalBody>
//           Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
//           <Button color="secondary" onClick={this.toggle}>Cancel</Button>
//         </ModalFooter>
//         </Modal> */}
      
//       </div>
//       </SplitterLayout>
//     </div>
//     <Footer/>

//     </div>
//   );
//   }
// }

// export default App;

// const styles = StyleSheet.create({
//   appContainer: {
//   overflow: 'hidden',
//   height: '100%',
//   display: 'flex',
//   flexFlow: 'column'
//   },
//   contentFrameContainer: {
//   display: 'flex',
//   flex: 1,
//   position: 'relative',
//   //flexFlow: 'column',
//   height: '100%'
//   },
//   sidebarSplitter: {
//   }
// });

const styles = {
  appContainer: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  contentFrameContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    //flexFlow: 'column',
    height: '100%'
  },
  sidebarSplitter: {
  }
};

// const useStyles = makeStyles({
//   appContainer: {
//     overflow: 'hidden',
//     height: '100%',
//     display: 'flex',
//     flexFlow: 'column'
//   },
//   contentFrameContainer: {
//     display: 'flex',
//     flex: 1,
//     position: 'relative',
//     //flexFlow: 'column',
//     height: '100%'
//   },
//   sidebarSplitter: {
//   }
// });

export default hot(withStyles(styles)(App));
