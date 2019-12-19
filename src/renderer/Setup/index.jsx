import React from 'react';
import { hot } from 'react-hot-loader/root';
import path from 'path';
import { remote, ipcRenderer as ipc } from 'electron';
import clsx from 'clsx';
import Color from 'color';
import isInt from 'validator/es/lib/isInt';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Strings, Texts } from '@i18n';
import { normalizeGreek } from 'lyxlib/utils/str';
import { fileDialogFilters } from '@utils/dialog';
import { appTitle } from '@utils';
import { Errors } from '@utils/errors';
import bm from '@app/globals';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import NewInstallationIcon from '@material-ui/icons/PlaylistAdd';
import DatabaseToolsIcon from '@material-ui/icons/SettingsRounded';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import HomeImportOutlineIcon from 'mdi-material-ui/HomeImportOutline';
import DatabaseIcon from 'mdi-material-ui/Database';
import FileUndoIcon from 'mdi-material-ui/FileUndo';

import MessageOverlay from '@renderer/components/MessageOverlay';
import LongButton from './LongButton';
import InputSelect from '@renderer/components/InputSelect';
import InputFile from '@renderer/components/InputFile';
import InputPassword from '@renderer/components/InputPassword';
import InputDialog from '@renderer/components/dialogs/InputDialog';

import '@assets/fonts/MaterialDesignIcons/material-icons.css';
import '@assets/fonts/Roboto/index.css';
import '@renderer/styles.scss';
import { setPriority } from 'os';


class Setup extends React.Component {
  static defaultProps = {}
  state = {
    newInstallation: false,
    pages: {
      stack: [],
      // current
    },
    breadcrumbs: [],
    nextButtonText: normalizeGreek(Strings.titles.Previous),
    previousButtonText: normalizeGreek(Strings.titles.Previous),
    configFile: '',
    showNextButton: false,
    showPreviousButton: false,
    showConfigFilePasswordPrompt: false,

    mode: '', // new | existing | error
    newType: '', // Personal | Business
    dbType: '', // local | config | <dbtypes>
    dbFile: '', // for SQLite
    dbHost: '',
    dbPort: '',
    dbUSer: '',
    dbPassword: ''
  }

  constructor(props) {
    super(props);

    this.handleDBTypeChange = this.handleDBTypeChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.goPreviousPage = this.goPreviousPage.bind(this);
  }

  componentDidMount() {
    const { internal } = this.props.appInit || {};
    const { code, translated: msg } = internal || {};
    const newInstallation = code === Errors.DB.NotInitialized;
    const stack = [newInstallation ? 'SelectInstallation' : 'DBConnectionTools'];
    const current = 0;

    document.title = appTitle(Strings.titles.Installation);
    this.setState({ pages: { stack, current }, newInstallation, msg });
  }

  componentWillUnmount() {

  }

  handleDBTypeChange(dbType) {
    console.log('handleDBTypeChange', dbType);

    if(dbType === 'config') {
      //this.setState({ showConfigFilePasswordPrompt: true, dbType });


      const { dialog, getCurrentWindow } = remote;

      console.log('filtgers', fileDialogFilters(['bmc', 'all']));

      dialog.showOpenDialog(getCurrentWindow(), {
        title: Strings.titles.DBConfigFile,
        filters: fileDialogFilters(['bmc', 'all']),
        properties: ['openFile']
      })
      .then(({ canceled, filePaths }) => {
        if(canceled) {
          return this.setState({ dbType: '' });
        }
      })
      .catch(error => {
        
      });
    } else {
      this.setState({ dbType });
    }
  }

  handlePortChange({ target: { value: dbPort }}) {
    if(!dbPort.length || isInt(dbPort, { min: 1, max: 0x10000 -1 })) {
      this.setState({ dbPort });
    }
  }

  goNextPage(page, breadcrumb) {
    const { breadcrumbs, pages: { stack }} = this.state;

    stack.push(page);
    const current = stack.length - 1;

    breadcrumbs.push(breadcrumb);

    this.setState({
      pages: { stack, current },
      showPreviousButton: true
    });
  }

  goPreviousPage() {
    const { breadcrumbs, pages: { stack }} = this.state;

    if(stack.length) {
      stack.pop();
      const current = stack.length - 1;

      if(breadcrumbs.length) {
        breadcrumbs.pop();
      }

      this.setState({
        pages: { stack, current },
        breadcrumbs,
        showPreviousButton: stack.length > 1
      });
    }
  }

  renderHeader() {
    const { classes } = this.props;
    const { msg, breadcrumbs } = this.state;
    const { title, type, message } = msg || {};

    return (
      <header className={classes.header}>
        <img src={require('@assets/Logo_square_XS.png').default} className={classes.logo}/>
        <div>
          <Typography classes={{ root: classes.title }} variant="h4" component="span" display="inline">
            {Strings.titles.Installation}
          </Typography>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="inherit"/>}>
              {breadcrumbs.filter(v => v).map((text, i) => (
                <Typography key={`bci-${i}`} variant="body2" color="textPrimary">{text}</Typography>
              ))}
            </Breadcrumbs>
          )}
        </div>
        {msg && <MessageOverlay type={type} title={title} message={message}/>}
        {/* <MessageOverlay 
          type={'warning'}
          title="Testing this message 👌" 
          message={`But that doesn't really explain the pros and cons of each. I am looking for an explanation, and possibly a simple example (use case) highlighting those similarities / differences.\nWhy would one use one over the other? (3)`}
        /> */}
      </header>
    );
  }

  renderFooter() {
    const { classes } = this.props;
    const {
      nextButtonText,
      previousButtonText,
      showNextButton,
      showPreviousButton
    } = this.state;

    return (showPreviousButton || showNextButton) && (
      <footer className={classes.footer}>
        {showPreviousButton && (
          <Button onClick={this.goPreviousPage} startIcon={<NavigateBeforeIcon/>}>
            {previousButtonText}
          </Button>
        )}
        {showNextButton && (
          <Button variant="contained" onClick={this.goNextPage} color="primary">
            {nextButtonText}
          </Button>
        )}
      </footer>
    );
  }

  renderContent() {
    const { pages: { stack, current }} = this.state;
    const page = current !== undefined && stack[current];

    switch(page) {
      case 'SelectInstallation': return this.renderPage_SelectInstallation();
      case 'SelectMode': return this.renderPage_SelectMode();
      case 'SelectLocalOrConnectTo': return this.renderPage_SelectLocalOrConnectTo();
      case 'DBConnectionTools': return this.renderPage_DBConnectionTools();
    }
  }

  renderPage_DBConnectionTools() {
    const { classes } = this.props;
    const dbTypes = [...bm.specs.db.supported, null, 'config'];
    const dbTypeTexts = {...Texts.DB.Types, config: Strings.titles.FromConfigFile};
    const {
      showConfigFilePasswordPrompt,
      configFile,
      dbType,
      dbPort
    } = this.state;

    console.log('renderPage_DBConnectionTools', typeof(dbType), `'${dbType}'`);

    return (
      <div className={classes.dbConnectionTools}>
        <div className={classes.dbConnectionTools_connectionSettings}>
          <div className={clsx(classes.inputRow, classes.inputRowButtons)}>
            <InputSelect label={Strings.titles.DBType}
              className={classes.dbConnectionTools_inputDBType}
              classes={{ helperText: classes.dbConnectionTools_inputDBTypeHelper }}
              value={dbType}
              values={dbTypes}
              texts={dbTypeTexts}
              helperText={configFile}
              onChange={this.handleDBTypeChange}
            />
            {!!configFile && (
              <IconButton onClick={() => {}}>
                <FileUndoIcon/>
              </IconButton>
            )}
            {/* <InputFile label={"Select file"}
              className={clsx(classes.inputRow, classes.inputFullWidth)}
              onFileSelect={file => console.log('got file', file)}
              dialog={{
                title: 'Select file dialog',
                defaultPath: 'C:\\Dev',
                buttonLabel: 'Btn label!!',
                filters: [{
                  name: 'All Files', extensions: ['*']
                }],
                showSave: true
              }}
            /> */}
          </div>

          <div className={classes.inputRow}>
            <TextField label={Strings.titles.ServerAddress} 
              className={clsx(classes.inputFull, classes.inputInline)}
            />
            <TextField label={Strings.titles.Port}
              value={dbPort}
              className={classes.dbConnectionTools_inputPort}
              onChange={this.handlePortChange}
            />
          </div>
          <div className={classes.inputRow}>
            <TextField label={Strings.titles.User} className={classes.inputInline}/>
            <InputPassword disabled label={Strings.titles.Password}/>
          </div>
        </div>
        <div className={classes.dbConnectionTools_connectionFunctions}>

        </div>
        <InputDialog
          fullWidth
          maxWidth="xs"
          title={Strings.titles.ConfigurationFilePassword}
          message={Strings.messages.InputPasswordForProtectedConfigFile}
          open={showConfigFilePasswordPrompt}
          onConfirm={() => {
            console.log('dialog configm');
            this.setState({ showConfigFilePasswordPrompt: false });
          }}
          onCancel={() => {
            console.log('dialog cancel');
            this.setState({ showConfigFilePasswordPrompt: false, dbType: '' });
          }}
          onValidate={async () => {
            console.log('dialog validate');
            return true;
          }}
        >
          <InputPassword label={Strings.titles.Password}/>
        </InputDialog>
      </div>
    );
  }

  renderPage_SelectInstallation() {
    const { classes: {
      selectInstallation,
      selectInstallation_longButtonRoot: root,
      selectInstallation_longButtonIcon: icon,
      longButton: button
    }} = this.props;

    const classes = { root, button, icon }

    return (
      <div className={selectInstallation}>
        <LongButton title={Strings.titles.NewInstallation}
          onClick={this.goNextPage.bind(this, 'SelectMode', Strings.titles.NewInstallation)}
          icon={NewInstallationIcon}
          classes={classes}
        />
        <LongButton title={Strings.titles.ConnectToExistingDB}
          onClick={this.goNextPage.bind(this, 'DBConnectionTools', null)}
          icon={DatabaseToolsIcon}
          classes={classes}
        />
      </div>
    );
  }

  renderPage_SelectMode() {
    const { classes } = this.props;
    const modes = ['Personal', 'Business'];

    return (
      <div className={classes.selectMode}>
        {modes.map(mode => (
          <LongButton key={`select-mode-${mode}`} 
            onClick={this.goNextPage.bind(this, 'SelectLocalOrConnectTo', mode)}
            title={mode}
            classes={{
              root: classes.selectMode_longButtonRoot,
              header: classes.selectMode_longButtonHeader,
              content: classes.selectMode_longButtonContent,
              button: classes.longButton
            }}
          >
            <div className={classes.selectMode_description}>{Strings.content.ApplicationFunctions[mode].Description}</div>
            <ul className={classes.selectMode_items}>
              {Strings.content.ApplicationFunctions[mode].Items.map((item, index) => (
                <li key={`select-mode-${mode}-item-${index}`}>{item}</li>
              ))}
            </ul>
          </LongButton>
        ))}
      </div>
    );
  }

  renderPage_SelectLocalOrConnectTo() {
    const { classes: {
      selectInstallation,
      selectInstallation_longButtonRoot: root,
      selectInstallation_longButtonIcon: icon,
      longButton: button
    }} = this.props;

    const classes = { root, button, icon }

    return (
      <div className={selectInstallation}>
        <LongButton title={Strings.titles.LocalDBInstallation}
          subtitle={`${Strings.content.DBInstallationType.Local.Description} (${Strings.titles.Suggested.toLowerCase()})`}
          onClick={this.goNextPage.bind(this, 'SelectMode', Strings.titles.LocalInstallation)}
          icon={HomeImportOutlineIcon}
          classes={classes}
        />
        <LongButton title={Strings.titles.DBConnectionSettings}
          subtitle={`${Strings.content.DBInstallationType.Advanced.Description} (${Strings.titles.Advanced.toLowerCase()})`}
          onClick={this.goNextPage.bind(this, 'DBConnectionTools', Strings.titles.ConnectionSettings)}
          icon={DatabaseIcon}
          classes={classes}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline/>
        <div className={classes.container}>
          {this.renderHeader()}
          <section className={classes.section}>{this.renderContent()}</section>
          {this.renderFooter()}
        </div>
      </React.Fragment>
    );
  }
}


const styles = theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'visible'
  },
  header: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    userSelect: 'none'
  },
  title: {
    color: '#000000ab'
  },
  logo: {
    width: 150,
    margin: '6px 4vw'
  },

  section: {
    display: 'flex',
    flex: 1,
    backgroundColor: bm.colors.wizardPanel
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: theme.spacing(1),
    '& > button': {
      marginLeft: theme.spacing(1)
    }
  },

  longButton: {
    flex: 1,
    fontSize: '1.5em',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 4),
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: theme.palette.primary.light,
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0,0,0,.3)',

    '&:hover': {
      borderColor: theme.palette.secondary.light,
      //backgroundColor: Color(theme.palette.secondary.main).alpha(.08).string()
      backgroundColor: Color(theme.palette.secondary.main).lighten(.8).string()
    }
  },

  inputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1)
  },
  inputRowButtons: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  inputFullWidth: {
    width: '100%'
  },
  inputInline: {
    marginRight: theme.spacing(1)
  },
  inputFull: {
    flex: 1
  },

  // Pages
  selectInstallation: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: theme.spacing(0, 4)
  },
  selectInstallation_longButtonRoot: {
    height: '34%'
  },
  selectInstallation_longButtonIcon: {
    fontSize: '2em',
    marginRight: theme.spacing(2)
  },

  selectMode: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  selectMode_longButtonRoot: {
    width: '44%',
    margin: theme.spacing(3, 0)
  },
  selectMode_longButtonHeader: {
    marginBottom: theme.spacing(2)
  },
  selectMode_longButtonContent: {
    textAlign: 'left'
  },
  selectMode_description: {
    fontSize: '.9rem'
  },
  selectMode_items: {
    fontSize: '.9rem',
    paddingLeft: theme.spacing(4)
  },

  dbConnectionTools: {
    display: 'flex',
    flex: 1
  },
  dbConnectionTools_connectionSettings: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing(3)
  },
  dbConnectionTools_connectionFunctions: {
    display: 'flex',
    width: '34%',
    flexDirection: 'column',
    padding: theme.spacing(3),
    borderLeft: '1px solid lightgray'
  },
  dbConnectionTools_inputDBType: {
    width: 240
  },
  dbConnectionTools_inputDBTypeHelper: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    direction: 'rtl',
    textAlign: 'left',
    color: theme.palette.primary.main
  },
  dbConnectionTools_inputPort: {
    width: 100
  }
});

export default hot(withStyles(styles)(Setup));
