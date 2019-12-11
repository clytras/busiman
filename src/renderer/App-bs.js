import React from 'react'
import ReactDOM from 'react-dom';
import { copyStyles } from '../utils/DOM';
import SplitterLayout from 'react-splitter-layout';
import NewWindow from 'react-new-window'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from '@i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import SideNav from './components/SideNav';

import * as platform from 'platform';


import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faTimes, 
  faSearchMinus, 
  faSearchPlus, 
  faMapMarkerAlt,
  faHandPointLeft,
  faHome
} from '@fortawesome/free-solid-svg-icons';

/* Font Awesome Icons */
library.add(
  faTimes,
  faSearchMinus,
  faSearchPlus,
  faMapMarkerAlt,
  faHandPointLeft,
  faHome
);

import 'bootstrap/dist/css/bootstrap.css';
import 'react-splitter-layout/lib/index.css';
import './styles.scss';

// const App = () => (
//     <div>
//         <h4>Welcome to React, Electron and JS!!</h4>
//         <NewWindow title="Test">
//             <h1>Hi 👋</h1>
//         </NewWindow>
//     </div>
// )



class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    modal: false,
    modalsIndex: 0
  };

  this.toggle = this.toggle.bind(this);
  this.openPopup = this.openPopup.bind(this);
  }

  componentWillMount() {
  document.body.classList.add(`platform-${process.platform}`);
  }
  
  toggle() {
  this.setState({
    modal: !this.state.modal
  });
  }



  openPopup() {
  //window.open('https://github.com', '_blank', 'nodeIntegration=no')

  let modal = window.open('', `modal-${this.state.modalsIndex++}`, 'width=300,height=250')
  

  modal.document.write('<div id="hdr"></div>')
  copyStyles(document, modal.document);

  ReactDOM.render(
    <Header/>,
    modal.document.getElementById('hdr')
  );
  }
  
  render() {
  //window.open('https://github.com', '_blank', 'nodeIntegration=no')

  /*                <NewWindow title="Test" name="MyWindow">
      <h1>Hi 👋</h1>
    </NewWindow> */

  return (
    <div className={css(styles.appContainer)}>
    <Header/>
    <div className={css(styles.contentFrameContainer)}>
      <SplitterLayout className={css(styles.sidebarSplitter)}
        percentage
        primaryMinSize={15}
        secondaryInitialSize={75}
      >
      <SideNav/>
      <div>
        <h4>Welcome to React, Electron and JS!!!! {Strings.Home}</h4>
        <pre>{
        [platform.name,
        platform.version,
        platform.product,
        platform.manufacturer,
        platform.layout,
        platform.os,
        platform.description].join("\n")
        }</pre>
      
        <Button color="danger" onClick={this.openPopup}>{"Open Modal!!"}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
        </Modal>
      
      </div>
      </SplitterLayout>
    </div>
    <Footer/>

    </div>
  );
  }
}

export default App;

const styles = StyleSheet.create({
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
});
