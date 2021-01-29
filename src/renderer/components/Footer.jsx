import { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';


export default function() {
  const classes = useStyles();

  return (
    <footer className={classes.container}>
      {"Footer"}
    </footer>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: 'calc(1rem + 10px)',
    backgroundColor: theme.palette.primary.light
  }
}));
