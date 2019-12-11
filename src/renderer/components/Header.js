import React, { useState, useEffect } from 'react';
// import { StyleSheet, css } from 'aphrodite/no-important';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Strings } from '@i18n';
import Globals from '@app/globals';


export default function() {
  const classes = useStyles();
  const [counter, setCounter] = useState(0);

  function adjCounter(value) {
    setCounter(counter + value);
  }

  return (
    <header className={classes.headerContainer}>
      {Strings.Home} <span className={classes.counter}>{counter}</span><span onClick={adjCounter.bind(this, 1)} className={classes.btn}>Inc</span><span onClick={adjCounter.bind(this, -1)} className={classes.btn}>Dec</span>
    </header>
  );
}

const useStyles = makeStyles({
  headerContainer: {
    padding: 10,
    borderBottom: `1px solid ${Globals.colors.frameBorders}`,
    color: 'red'
  },

  counter: {
    marginRight: 10
  },
  btn: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: 'green'
  }
});

// export default class Header extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <header className={css(styles.headerContainer)}>
//         {Strings.Home}
//       </header>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   headerContainer: {
//     padding: 10,
//     borderBottom: `1px solid ${Globals.colors.frameBorders}`,
//     color: 'red'
//   }
// });
