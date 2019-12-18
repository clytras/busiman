import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';

import useCombinedRefs from 'lyxlib/react/hooks/refs';

export default forwardRef(function({
  children
}, ref) {
  // const thisRef = useRef();

  useImperativeHandle(ref, () => ({
    myFunc: (a, b) => {
      console.log('myFunc test!', a, b);
    }
  }));



  return children;
});
