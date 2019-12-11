import { remote } from 'electron';
import { Strings } from '@i18n';

const { Menu } = remote;

export function setupContextMenus() {
  const InputMenu = Menu.buildFromTemplate([
    {
      label: Strings.titles.Undo,
      role: 'undo',
      accelerator: 'CmdOrCtrl+Z', 
    }, {
      label: Strings.titles.Redo,
      role: 'redo',
      accelerator: 'CmdOrCtrl+Y', 
    }, {
      type: 'separator',
    }, {
      label: Strings.titles.Cut,
      role: 'cut',
      accelerator: 'CmdOrCtrl+X', 
    }, {
      label: Strings.titles.Copy,
      role: 'copy',
      accelerator: 'CmdOrCtrl+C', 
    }, {
      label: Strings.titles.Paste,
      role: 'paste',
      accelerator: 'CmdOrCtrl+V', 
    }, {
      type: 'separator',
    }, {
      label: Strings.titles.SelectAll,
      role: 'selectall',
      accelerator: 'CmdOrCtrl+A', 
    },
  ]);

  const CopyMenu = Menu.buildFromTemplate([
    {
      id: 'copy',
      label: Strings.titles.Copy,
      accelerator: 'CmdOrCtrl+C', 
      role: 'copy',
      enabled: false
    }
  ]);
  
  document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const hasSelection = !!document.getSelection().toString();
    let node = e.target;

    console.log('doc.selection', `"${document.getSelection()}"`, JSON.stringify(document.getSelection()), hasSelection);
  
    while(node) {
      console.log('checking node', node.className);

      const { className } = node;

      if(/^MenuCopy/.test(className)) {
        const copyMenuItem = CopyMenu.getMenuItemById('copy');
        copyMenuItem.enabled = hasSelection;
        CopyMenu.popup(remote.getCurrentWindow());
        break;
      }

      const { nodeName } = node;

      if(node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
        InputMenu.popup(remote.getCurrentWindow());
        break;
      }
      node = node.parentNode;
    }
  });
}
