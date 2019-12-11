import { dialog } from 'electron';

const OK = 'OK';
const Cancel = 'Cancel';
const Yes = 'Yes';
const No = 'No';
const Retry = 'Retry';
const Close = 'Close';

export class MsgBox {

  static Buttons = {
    OK: [OK],
    Cancel: [Cancel],
    Yes: [Yes],
    No: [No],
    Retry: [Retry],
    Close: [Close],
    OKCancel: [OK, Cancel],
    YesNo: [Yes, No],
    YesNoCancel: [Yes, No, Cancel],
    YesCancel: [Yes, Cancel],
    NoCancel: [No, Cancel],
    RetryCancel: [Retry, Cancel]
  }

  static show({
    type,
    buttons = MsgBox.Buttons.OK,
    title,
    message,
    detail,
    checkboxLabel,
    checkboxChecked = false,
    icon,
    defaultId,
    cancelId 
  }, window) {
    return dialog.showMessageBoxSync(window, {
      type,
      buttons,
      title,
      message,
      detail,
      checkboxLabel,
      checkboxChecked,
      icon,
      defaultId,
      cancelId 
    });
  }
}
