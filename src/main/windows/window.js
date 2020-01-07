import { isDevMode } from '@utils';

export class Window {
  window = null;
  popups = [];

  constructor(browserWindowOptions, options) {
    this.browserWindowOptions = browserWindowOptions || {};
    this.options = options || {};
  }

  create({ force = false } = {}) {
    if(this.window !== null) {
      if(!force) {
        return false;
      }
      this.window.close();
    }
    return true;
  }

  get hasWindow() {
    return this.window !== null;
  }

  restoreFocus() {
    if(this.window) {
      if(this.window.isMinimized()) this.window.restore()
      this.window.focus()
    }
    return this;
  }

  show() {
    if(this.window) {
      this.window.show();
    }
    return this;
  }

  close() {
    if(this.window) {
      this.window.close();
    }
    return this;
  }

  openDevTools() {
    if(this.window && isDevMode()) {
      this.window.webContents.openDevTools();
    }
    return this;
  }

  on(event, callback) {
    if(this.window) {
      this.window.on(event, callback);
    }
    return this;
  }

  once(event, callback) {
    if(this.window) {
      this.window.once(event, callback);
    }
    return this;
  }

  send(event, ...args) {
    if(this.window) {
      this.window.webContents.send(event, ...args)
    }
    return this;
  }
}
