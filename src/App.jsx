import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import * as platform from 'platform';
import SplitterLayout from 'react-splitter-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from './i18n/strings';
import { copyStyles } from './utils/DOM';

import Header from './ui/Header';
import Footer from './ui/Footer';
import SideNav from './ui/SideNav';

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

export default class App extends React.Component {
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
    console.log('toggle');
    // this.setState({
    //     modal: !this.state.modal
    // });
  }

  openPopup() {
    console.log('openPopup');
    //window.open('https://github.com', '_blank', 'nodeIntegration=no')

    let modal = window.open(
      '',
      `modal-${this.state.modalsIndex++}`,
      'width=300,height=250,nodeIntegration=no'
    );

    modal.addEventListener('DOMContentLoaded', function() {
      //console.log(this);
      this.console.log('Modal DOMContentLoaded', this);
      this.document.body.innerHTML = '<div id="hdr"></div>';

      copyStyles(document, this.document);

      ReactDOM.render(
          <Header/>,
          this.document.getElementById('hdr')
          //modal.document.body
      );
    });
    // modal.document.addEventListener( "DOMContentLoaded", function() {
    //     modal.window.console.log('Modal reacdy');
    // });

    // let newDiv = modal.document.createElement("div", { id: 'hdr'});



    //modal.document.write('<div id="hdr"></div>');
    //modal.document.body.innerHTML = '<div id="hdr"></div>';
    //modal.document.body.appendChild(newDiv);
    //copyStyles(document, modal.document);

    console.log(
      'new modal',
      modal.document,
      modal.document.body,
      modal.document.write,
      //modal.document.getElementById('hdr')
    );

    // ReactDOM.render(
    //     <Header/>,
    //     modal.document.getElementById('hdr')
    //     //modal.document.body
    // );
  }

  render() {
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
          <div style={{height: '100%'}}>
              <h4>Welcome to React, Electron and JS !! {Strings.Home}</h4>
              <pre>{
                  [platform.name,
                  platform.version,
                  platform.product,
                  platform.manufacturer,
                  platform.layout,
                  platform.os,
                  platform.description].join("\n")
              }</pre>
              <h3>CLI arguments</h3>
              <pre>{JSON.stringify(remote.process.argv, null, 2)}</pre>

              <Button color="danger" onClick={this.openPopup}>{"Open Modal!!!"}</Button>
              {/*<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                  <ModalBody>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                  </ModalFooter>
            </Modal>*/}
            {/*<iframe
              width="600"
              height="450"
              frameborder="0"
              style={{ width: '100%', height: '100%', border: 0}}
              src="https://www.google.com/maps/embed/v1/view?key=&zoom=12&center=37.9838%2C23.7275"
              allowfullscreen></iframe>
            */}
          </div>
        </SplitterLayout>
      </div>
      <Footer/>
    </div>
    );
  }
}

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
