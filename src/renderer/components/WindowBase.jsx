import React from 'react';
// import { hot } from 'react-hot-loader/root';
import CssBaseline from '@material-ui/core/CssBaseline';

import '@assets/fonts/MaterialDesignIcons/material-icons.css';
import '@assets/fonts/Roboto/index.css';
import 'simplebar/dist/simplebar.min.css';
import '@renderer/styles.scss';

// export default function(WrappedComponent) {
//   return hot(class extends React.Component {
//     // constructor(props) {
//     //   super(props);
//     // }

//     render() {
//       return (
//         <React.Fragment>
//           <CssBaseline/>
//           <WrappedComponent/>
//         </React.Fragment>
//       );
//     }
//   });
// }

// class WindowBase extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { children } = this.props;
//     return (
//       <React.Fragment>
//         <CssBaseline/>
//         {children}
//       </React.Fragment>
//     );
//   }
// }

function WindowBase({ children }) {
  return (
    <React.Fragment>
      <CssBaseline/>
      {children}
    </React.Fragment>
  );
}

export default WindowBase;
