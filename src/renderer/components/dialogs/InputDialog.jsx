import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Strings } from '@i18n';
import util from 'util';


export default function({
  open,
  title,
  message,
  confirmText = Strings.titles.OK,
  cancelText = Strings.titles.Cancel,
  showLoading = false,

  onConfirm,
  onCancel,
  onValidate,

  children,
  ...props
}) {

  function handleConfirm() {
    if(onConfirm) {
      if(onValidate) {
        if(onValidate instanceof Promise || util.types.isAsyncFunction(onValidate)) {
          onValidate().then(valid => valid && onConfirm()).catch(() => {});
        } else if(typeof(onValidate) === 'function') {
          console.log('onValidate is function');
          if(onValidate()) {
            onConfirm();
          }
        }
      } else {
        onConfirm();
      }
    }
  }

  function handleClose() {
    onCancel && onCancel();
  }

  return (
    <Dialog open={open} onClose={handleClose} {...props}>
      {!!title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {!!message && <DialogContentText>{message}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">{cancelText}</Button>
        <Button onClick={handleConfirm} color="primary">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}
