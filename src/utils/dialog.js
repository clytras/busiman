import { dialog, remote } from 'electron';
import { Strings } from '@i18n';

const isRenderer = require('is-electron-renderer');

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

  static showSync(options, window) {
    return this.show(options, window, (isRenderer ? remote.dialog : dialog).showMessageBoxSync);
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
  }, window, fn) {

    let browserWindow;

    if(isRenderer && window === 'current') {
      const { getCurrentWindow } = remote;
      browserWindow = getCurrentWindow();
    } else {
      browserWindow = window;
    }

    if(!fn) {
      fn = (isRenderer ? remote.dialog : dialog).showMessageBox;
    }

    return fn(browserWindow, {
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

export function fileDialogFilters(filters = ['all']) {
  const result = [];

  for(let filter of filters) {
    const name = Strings.system.fileDialog.filters[filter];
    let extensions;

    switch(filter) {
      case 'all':
        extensions = ['*'];
        break;
      case 'sqlite':
        extensions = ['sqlite', 'db', 'sqlite3', 'db3'];
        break;
      default:
        extensions = [filter];
    }

    result.push({ name, extensions });
  }

  return result;
}
