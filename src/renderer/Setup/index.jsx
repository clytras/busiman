import React from 'react';
import { hot } from 'react-hot-loader/root';
import path from 'path';
import util from 'util';
import fs from 'fs';
import lfs from 'lyxlib/utils/fs';
import { remote, ipcRenderer as ipc } from 'electron';
import clsx from 'clsx';
import Color from 'color';
import isInt from 'validator/es/lib/isInt';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Strings, Texts } from '@i18n';
import { normalizeGreek } from 'lyxlib/utils/str';
import { fileDialogFilters } from '@utils/dialog';
import { DB, isDBTypeSQLite, isDBTypeSupported } from '@db';
import { setupDBData } from '@renderer/ipc/db/setup';
import { loadDBConfigFile, encryptDBProperties } from '@utils/config';
import { MsgBox } from '@utils/dialog';
import { appTitle } from '@utils';
import { Errors, translateInternal, fail } from '@utils/errors';
import bm from '@app/globals';

import LinearProgress from '@material-ui/core/LinearProgress';
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
import DatabaseCheckIcon from 'mdi-material-ui/DatabaseCheck';
import FileUndoIcon from 'mdi-material-ui/FileUndo';
import FinishedSuccessIcon from 'mdi-material-ui/CheckboxMultipleMarkedCircleOutline';

import MessageOverlay from '@renderer/components/MessageOverlay';
import LongButton from './LongButton';
import LoadingButton from '@renderer/components/LoadingButton';
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
    loading: false,
    newInstallation: false,
    testingConnection: false,
    finished: false,
    pages: {
      stack: [],
      // current
    },
    breadcrumbs: [],
    nextButtonText: normalizeGreek(Strings.titles.Next),
    previousButtonText: normalizeGreek(Strings.titles.Back),
    configFile: '',
    configFilePassword: '',
    configFilePasswordError: false,
    showNextButton: false,
    showPreviousButton: false,
    showNewInstallationButton: false,
    enableNextButton: false,
    showConfigFilePasswordPrompt: false,
    sqliteError: '',

    mode: '', // new | existing | error
    newType: '', // Personal | Business
    dbType: '', // local | <dbtypes>
    dbFile: '', // for SQLite
    dbHost: '',
    dbPort: '',
    dbUser: '',
    dbPassword: '',
    dbDatabase: ''
  }

  constructor(props) {
    super(props);

    this.resetDBInputs = this.resetDBInputs.bind(this);
    this.handleDBTypeChange = this.handleDBTypeChange.bind(this);
    
    this.handleNewInstallationClick = this.handleNewInstallationClick.bind(this);
    this.handleHostChange = this.handleHostChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleDatabaseChange = this.handleDatabaseChange.bind(this);
    this.handleConfigPasswordChange = this.handleConfigPasswordChange.bind(this);
    this.handleConfigPasswordConfirm = this.handleConfigPasswordConfirm.bind(this);
    this.handleConfigPasswordClose = this.handleConfigPasswordClose.bind(this);
    this.handleUnloadConfigFile = this.handleUnloadConfigFile.bind(this);

    this.applyConfigFilePassword = this.applyConfigFilePassword.bind(this);
    this.applyConfigFileData = this.applyConfigFileData.bind(this);
    
    this.handleSQLiteSelectFile = this.handleSQLiteSelectFile.bind(this);
    this.canTestConnection = this.canTestConnection.bind(this);
    this.testConnection = this.testConnection.bind(this);
    this.createLocalDB = this.createLocalDB.bind(this);
    this.goPreviousPage = this.goPreviousPage.bind(this);
  }

  async componentDidMount() {
    const { internal, connection } = this.props.appInit || {};
    const { code, translated } = internal || {};
    const newInstallation = code === Errors.DB.NotInitialized;
    const stack = [newInstallation ? 'SelectInstallation' : 'DBConnectionTools'];
    const current = 0;
    const mode = !newInstallation && !!code ? 'error' : '';
    const showNewInstallationButton = !newInstallation;

    let msg;
  
    if (code === Errors.DB.CantConnect) {
      msg = {
        type: 'warning',
        title: Strings.messages.DBProblem,
        message: Strings.expand(Strings.messages.CantConnectToDBCheckInfo),
      }
    } else if (code) {
      msg = translateInternal(internal);
    }

    const {
      client: dbType = '',
      connection: {
        filename: dbFile = '',
        host: dbHost = '',
        port: dbPort = '',
        user: dbUser = '',
        password: dbPassword = '',
        database: dbDatabase = ''
      } = {}
    } = connection || {};

    // const stack = ['Finished'];
    // const current = 0;

    // (async () => {
    //   console.log('conf tb', (new Date).getTime());
    //   const result = await process.app.config.get('test', 'TEST DEF');
    //   console.log('conf te', (new Date).getTime());
    //   console.log(`process.app get test "${result}"`);
    // })();
    

    if (
      dbFile !== remote.process.app.db.dataDefaultSQLiteFile &&
      await lfs.existsAsync(remote.process.app.db.dataDefaultSQLiteFile)
    ) {
      setTimeout(async () => {
        const { response } = await MsgBox.show({
          type: 'question',
          buttons: MsgBox.Buttons.YesNo,
          message: Strings.expand(Strings.messages.UseDefaultDBFileExists)
        }, 'current');

        if (response === 0) {
          // use default
          const config = {
            client: 'sqlite',
            connection: {
              filename: remote.process.app.db.dataDefaultSQLiteFile
            }
          }
          await process.app.config.set('db.data.connection', encryptDBProperties(config));
          this.handleReload();
        }
      }, 700);
    }

    console.log('appTitle', appTitle(), appTitle("Test"));

    document.title = appTitle(Strings.titles.Installation);
    this.setState({
      mode,
      pages: { stack, current },
      newInstallation,
      showNewInstallationButton,
      msg,
      dbType, dbFile, dbHost, dbPort, dbUser, dbPassword, dbDatabase
    });
  }

  componentWillUnmount() {

  }

  resetDBInputs(ext = {}) {
    this.setState({
      dbFile: '',
      dbHost: '',
      dbPort: '',
      dbUser: '',
      dbPassword: '',
      dbDatabase: '',
      ...ext
    });
  }

  handleNewInstallationClick() {
    this.resetDBInputs({
      mode: '',
      newInstallation: true,
      showNewInstallationButton: false,
      msg: undefined,
      pages: {
        current: 0,
        stack: ['SelectInstallation']
      }
    });
  }

  handleDBTypeChange(dbType) {
    if (dbType === 'config') {
      //this.setState({ showConfigFilePasswordPrompt: true, dbType });

      const { dialog, getCurrentWindow } = remote;

      dialog.showOpenDialog(getCurrentWindow(), {
        title: Strings.titles.DBConfigFile,
        filters: fileDialogFilters(['bmc', 'all']),
        properties: ['openFile']
      })
      .then(({ canceled, filePaths }) => {
        // console.log(dbType, canceled, filePaths);

        if (canceled) {
          return this.setState({ dbType: '' });
        }

        const configFile = Array.isArray(filePaths) ? filePaths[0] : filePaths;
        const {
          ok, data, encrypted, internal, error
        } = loadDBConfigFile(configFile);

        // console.log('handleDBTypeChange', ok, data, encrypted, internal, error)

        if (ok) {
          // if (encrypted) {
          //   console.log('encrypted', configFile);
          //   this.setState({ configFile, showConfigFilePasswordPrompt: true })
          // } else {
          //   this.applyConfigFileData(data);
          // }
          if (!encrypted) {
            this.applyConfigFileData(data);
          }
          this.setState({ configFile, showConfigFilePasswordPrompt: !!encrypted })
        } else if (internal) {
          let detail = error ? error.toString() : undefined;
          MsgBox.show(translateInternal(internal, { detail }), 'current');
        } else if (error) {
          MsgBox.show({
            type: 'error',
            message: Strings.messages.LoadingFileError,
            detail: error.toString()
          }, 'current');
        } else {
          this.setState({ dbType: '', configFile: '', configFilePassword: '' });
        }
      })
      .catch(error => {
        MsgBox.show({
          type: 'error',
          message: Strings.messages.LoadingFileError,
          detail: error.toString()
        }, 'current');
      });
    } else {
      const { configFile } = this.state;
      if (configFile) {
        this.resetDBInputs({ dbType, configFile: '', configFilePassword: '' })
      } else {
        this.setState({ dbType, configFile: '', configFilePassword: '' });
      }
    }
  }

  handleHostChange = ({ target: { value: dbHost }}) => this.setState({ dbHost });
  handlePortChange({ target: { value: dbPort }}) {
    if (!dbPort.length || isInt(dbPort, { min: 1, max: 0x10000 -1 })) {
      this.setState({ dbPort });
    }
  }
  handleUserChange = ({ target: { value: dbUser }}) => this.setState({ dbUser });
  handlePasswordChange = dbPassword => this.setState({ dbPassword });
  handleDatabaseChange = ({ target: { value: dbDatabase }}) => this.setState({ dbDatabase });

  handleConfigPasswordChange = configFilePassword => {
    this.setState({ configFilePassword, configFilePasswordError: false });
  }

  handleConfigPasswordConfirm() {
    this.setState({
      configFilePassword: '',
      configFilePasswordError: false,
      showConfigFilePasswordPrompt: false
    });
  }

  handleConfigPasswordClose() {
    this.setState({
      dbType: '',
      configFile: '',
      configFilePassword: '',
      configFilePasswordError: false,
      showConfigFilePasswordPrompt: false
    });
  }

  handleUnloadConfigFile() {
    this.setState({
      configFile: '',
      dbType: '',
      dbFile: '',
      dbHost: '',
      dbPort: '',
      dbUser: '',
      dbPassword: '',
      dbDatabase: ''
    });
  }

  async handleSQLiteSelectFile(dbFile) {
    const { mode } = this.state;

    console.log('handleSQLiteSelectFile', dbFile, mode, await lfs.existsAsync(dbFile));

    if (!dbFile) {
      return this.setState({ dbFile, sqliteError: '' });
    }

    if (mode !== 'new' && !(await lfs.existsAsync(dbFile))) {
      return this.setState({ dbFile, sqliteError: Strings.messages.FileNotFound});
    }

    this.setState({ dbFile, sqliteError: '' });
  }

  handleSelectNewType(newType) {
    this.setState({ newType });
    this.goNextPage('SelectLocalOrConnectTo');

  }

  handleSelectInstallation(mode) {
    this.setState({ mode });

    if (mode === 'new') {
      this.goNextPage('SelectNewType', Strings.titles.NewInstallation);
    } else {
      this.goNextPage('DBConnectionTools', Strings.titles.ConnectToDB);
    }
  }

  handleReload() {
    const { app } = remote;
    app.relaunch();
    app.exit();
  }

  goNextPage(page, breadcrumb, exp = {}) {
    const { breadcrumbs, pages: { stack }} = this.state;

    stack.push(page);
    const current = stack.length - 1;

    breadcrumbs.push(breadcrumb);

    this.setState({
      pages: { stack, current },
      showPreviousButton: true,
      ...exp
    });
  }

  goPreviousPage() {
    const { breadcrumbs, pages: { stack }} = this.state;

    if (stack.length) {
      stack.pop();
      const current = stack.length - 1;

      if (breadcrumbs.length) {
        breadcrumbs.pop();
      }

      this.setState({
        pages: { stack, current },
        breadcrumbs,
        showPreviousButton: stack.length > 1
      });
    }
  }

  applyConfigFilePassword() {
    const { configFile, configFilePassword: secret } = this.state;

    if (!secret) {
      this.setState({ configFilePasswordError: true });
      return false;
    }

    const {
      ok, data, internal, error
    } = loadDBConfigFile(configFile, { secret });

    if (ok) {
      this.applyConfigFileData(data);
      return true;
    }

    if (internal) {
      MsgBox.show(translateInternal(internal), 'current');
    } else if (error) {
      MsgBox.show({
        type: 'error',
        message: Strings.messages.LoadingFileError,
        detail: error.toString()
      }, 'current');
    }

    return false;
  }

  applyConfigFileData(data) {
    const { db } = data || {};
    const {
      client: dbType = '',
      host: dbHost = '',
      port: dbPort = '',
      user: dbUser = '',
      password: dbPassword = '',
      database: dbDatabase = ''
    } = db || {};

    this.setState({
      dbType,
      dbHost,
      dbPort,
      dbUser,
      dbPassword,
      dbDatabase
    })
  }

  canTestConnection() {
    const { mode, dbType } = this.state;

    if (isDBTypeSQLite(dbType)) {
      const { dbFile } = this.state;
      return !!dbFile && (mode === 'new' || fs.existsSync(dbFile));
    }

    if (isDBTypeSupported(dbType)) {
      const { dbHost, dbUser, dbDatabase } = this.state;
      return !!dbHost && !!dbUser && !!dbDatabase;
    }
  }

  async testConnection() {
    const { mode, dbType: client } = this.state;
    const isNew = mode === 'new';
    const isExisting = mode === 'existing';
    const isError = mode === 'error';
    let config;

    if (isDBTypeSQLite(client)) {
      const { dbFile: filename } = this.state;
      const connection = { filename }
      config = { client, connection }

      if (isNew && await lfs.existsAsync(filename)) {
        const { response } = await MsgBox.show({
          type: 'question',
          buttons: MsgBox.Buttons.YesCancel,
          message: Strings.expand(Strings.messages.NewDBFileExists)
        });

        if (response === 1) { // No
          return;
        }

        try {
          await lfs.unlinkAsync(filename);
        } catch(error) {
          return await MsgBox.show({
            type: 'error',
            message: Strings.expand(Strings.messages.CouldNotDeleteThisFile, { file: filename })
          });
        }
      }
    } else {
      const {
        dbHost: host, 
        dbPort: port, 
        dbUser: user, 
        dbPassword: password, 
        dbDatabase: database
      } = this.state;
      const connection = { host, port, user, password, database }
      config = { client, connection }
    }

    this.setState({ loading: true, testingConnection: true });

    if (config) {
      setupDBData({ mode, config })
      .then(async ({ ok, ...rest }) => {
        console.log('setupDBData', ok, rest);
        if (ok) {
          if (isError) {
            const { response } = await MsgBox.show({
              type: 'question',
              buttons: MsgBox.Buttons.YesNo,
              message: Strings.expand(Strings.messages.DBConnectionSuccessRealodApp)
            });

            if (response === 0) { // Yes, save settings and reload app
              await process.app.config.set('db.data.connection', encryptDBProperties(config));
              this.handleReload();
            }
          } else {
            this.goNextPage('Finished', Strings.titles.Completed, { finished: true });
          }
        } else {
          throw rest;
        }
      })
      .catch(err => {
        console.log('setupDBData error', err);
        const { internal, error = err } = err || {};
        let msgbox;

        if (internal) {
          msgbox = translateInternal(internal);
        } else if (error) {
          msgbox = {
            type: 'error',
            message: Strings.messages.DBProblem,
            detail: error.toString()
          }
        }

        if (msgbox) {
          MsgBox.show(msgbox, 'current');
        }
      })
      .finally(() => {
        this.setState({ loading: false, testingConnection: false });
      });
    }
  }

  createLocalDB() {
    this.setState({
      dbType: 'sqlite',
      dbFile: remote.process.app.db.dataDefaultSQLiteFile
    }, this.testConnection);
  }

  renderHeader() {
    const { classes } = this.props;
    const { loading, msg, breadcrumbs } = this.state;
    const { title, type, message } = msg || {};

    console.log('renderHeader', loading);

    return (
      <>
        <header className={classes.header}>
          <div className={classes.headerRow}>
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
          </div>
          {loading && <LinearProgress color="secondary" />}
        </header>
      </>
    );
  }

  renderFooter(page) {
    const { classes } = this.props;
    const {
      mode,
      loading,
      nextButtonText,
      previousButtonText,
      showNewInstallationButton: showNew,
      showNextButton,
      showPreviousButton: showPrev
    } = this.state;
    let onPrevious = this.goPreviousPage,
        onNext = this.goNextPage,
        showNext = showNextButton, 
        nextText = nextButtonText, 
        disableNext;

    if (page === 'Finished') return;
    
    if (page === 'DBConnectionTools') {
      showNext = true;
      disableNext = !this.canTestConnection();
      onNext = this.testConnection;

      if (mode === 'error') {
        nextText = normalizeGreek(Strings.titles.TestConnection);
      }
    }

    return (showNew || showPrev || showNext) && (
      <footer className={classes.footer}>
        <div className={classes.footerAddonButtons}>
          {showNew && (
            <Button onClick={this.handleNewInstallationClick} variant="contained" color="primary" disabled={loading}>
              {normalizeGreek(Strings.titles.NewInstallation)}
            </Button>
          )}
        </div>
        <div>
          {showPrev && (
            <Button onClick={onPrevious} disabled={loading} startIcon={<NavigateBeforeIcon/>}>
              {previousButtonText}
            </Button>
          )}
          {showNext && (
            <Button onClick={onNext} variant="contained" disabled={loading || disableNext} color="primary">
              {nextText}
            </Button>
          )}
        </div>
      </footer>
    );
  }

  renderContent(page) {
    switch(page) {
      case 'SelectInstallation': return this.renderPage_SelectInstallation();
      case 'SelectNewType': return this.renderPage_SelectNewType();
      case 'SelectLocalOrConnectTo': return this.renderPage_SelectLocalOrConnectTo();
      case 'DBConnectionTools': return this.renderPage_DBConnectionTools();
      case 'Finished': return this.renderPage_Finished();
    }
  }

  renderDBType(dbType) {
    const { classes } = this.props;

    if (isDBTypeSQLite(dbType)) {
      const { loading, mode, sqliteError, dbFile } = this.state;

      return (
        <div className={classes.inputRow}>
          <InputFile className={classes.inputFullWidth}
            label={Strings.titles.DBFile}
            value={dbFile}
            error={!!sqliteError}
            disabled={loading}
            helperText={sqliteError}
            onFileSelect={this.handleSQLiteSelectFile}
            onChange={this.handleSQLiteSelectFile}
            inputProps={{
              readOnly: true
            }}
            dialog={{
              title: Strings.titles.DBFile,
              defaultPath: dbFile || process.app.dataPath,
              filters: fileDialogFilters(['sqlite', 'all']),
              showSave: mode === 'new'
            }}
          />
        </div>
      );
    }

    if (isDBTypeSupported(dbType)) {
      const { loading, configFile, dbHost, dbPort, dbUser, dbPassword, dbDatabase } = this.state;
      const disabled = loading || !!configFile;

      return (
        <>
          <div className={classes.inputRow}>
            <TextField className={clsx(classes.inputFull, classes.inputInline)}
              label={Strings.titles.ServerAddress} 
              value={dbHost}
              disabled={disabled}
              onChange={this.handleHostChange}
            />
            <TextField className={classes.dbConnectionTools_inputPort}
              label={Strings.titles.Port}
              value={dbPort}
              disabled={disabled}
              onChange={this.handlePortChange}
            />
          </div>
          <div className={classes.inputRow}>
            <TextField className={clsx(classes.inputFull, classes.inputInline)}
              label={Strings.titles.User} 
              value={dbUser}
              disabled={disabled}
              onChange={this.handleUserChange}
            />
            <InputPassword label={Strings.titles.Password}
              value={dbPassword} 
              //showPassword={disabled ? true : null}
              disabled={disabled}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div className={classes.inputRow}>
            <TextField className={classes.dbConnectionTools_inputDBType}
              label={Strings.titles.Database} 
              value={dbDatabase}
              disabled={disabled}
              onChange={this.handleDatabaseChange}
            />
          </div>
        </>
      );
    }
  }

  renderPage_DBConnectionTools() {
    const { classes } = this.props;
    const dbTypes = [...bm.specs.db.supported, null, 'config'];
    const dbTypeTexts = {...Texts.DB.Types, config: Strings.titles.FromConfigFile};
    const {
      loading,
      testingConnection,
      showConfigFilePasswordPrompt,
      configFile,
      configFilePasswordError,
      dbType
    } = this.state;

    // console.log('renderPage_DBConnectionTools', typeof(dbType), `'${dbType}'`);
    // console.log('configFilePasswordError', configFilePasswordError);

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
              disabled={loading}
              onChange={this.handleDBTypeChange}
            />
            {!!configFile && (
              <IconButton onClick={this.handleUnloadConfigFile}>
                <FileUndoIcon/>
              </IconButton>
            )}
          </div>
          {this.renderDBType(dbType)}
        </div>
        {/* <div className={classes.dbConnectionTools_connectionFunctions}>
          <LoadingButton variant="outlined" size="small" 
            startIcon={<DatabaseCheckIcon/>}
            disabled={!this.canTestConnection()}
            loading={loading}
            loadingIconSize={18}
            onClick={() => this.setState(({ loading }) => ({ loading: !loading }))}
          >{normalizeGreek(Strings.titles.TestConnection)}</LoadingButton>
        </div> */}
        <InputDialog fullWidth maxWidth="xs"
          title={Strings.titles.ConfigurationFilePassword}
          message={Strings.messages.InputPasswordForProtectedConfigFile}
          open={showConfigFilePasswordPrompt}
          onConfirm={this.handleConfigPasswordConfirm}
          onCancel={this.handleConfigPasswordClose}
          onValidate={this.applyConfigFilePassword}
        >
          <InputPassword label={Strings.titles.Password}
            error={configFilePasswordError}
            onChange={this.handleConfigPasswordChange}/>
        </InputDialog>
      </div>
    );
  }

  renderPage_SelectInstallation() {
    const { loading } = this.state;
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
          disabled={loading}
          onClick={this.handleSelectInstallation.bind(this, 'new')}
          icon={NewInstallationIcon}
          classes={classes}
        />
        <LongButton title={Strings.titles.ConnectToExistingDB}
          disabled={loading}
          onClick={this.handleSelectInstallation.bind(this, 'existing')}
          icon={DatabaseToolsIcon}
          classes={classes}
        />
      </div>
    );
  }

  renderPage_SelectNewType() {
    const { loading } = this.state;
    const { classes } = this.props;
    const newTypes = ['Personal', 'Business'];

    return (
      <div className={classes.selectNewType}>
        {newTypes.map(type => (
          <LongButton key={`select-type-${type}`} 
            onClick={this.handleSelectNewType.bind(this, type)}
            disabled={loading}
            title={type}
            classes={{
              root: classes.selectNewType_longButtonRoot,
              header: classes.selectNewType_longButtonHeader,
              content: classes.selectNewType_longButtonContent,
              button: classes.longButton
            }}
          >
            <div className={classes.selectNewType_description}>{Strings.content.ApplicationFunctions[type].Description}</div>
            <ul className={classes.selectNewType_items}>
              {Strings.content.ApplicationFunctions[type].Items.map((item, index) => (
                <li key={`select-mode-${type}-item-${index}`}>{item}</li>
              ))}
            </ul>
          </LongButton>
        ))}
      </div>
    );
  }

  renderPage_SelectLocalOrConnectTo() {
    const { loading } = this.state;
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
          disabled={loading}
          subtitle={`${Strings.content.DBInstallationType.Local.Description} (${Strings.titles.Suggested.toLowerCase()})`}
          onClick={this.createLocalDB}
          icon={HomeImportOutlineIcon}
          classes={classes}
        />
        <LongButton title={Strings.titles.DBConnectionSettings}
          disabled={loading}
          subtitle={`${Strings.content.DBInstallationType.Advanced.Description} (${Strings.titles.Advanced.toLowerCase()})`}
          onClick={this.goNextPage.bind(this, 'DBConnectionTools', Strings.titles.ConnectionSettings)}
          icon={DatabaseIcon}
          classes={classes}
        />
      </div>
    );
  }

  renderPage_Finished() {
    const { classes } = this.props;
    const { mode } = this.state;
    const isNew = mode === 'new';

    return (
      <div className={classes.finished}>
        <FinishedSuccessIcon className={classes.finished_icon}/>
        <Typography classes={{ root: classes.finished_title }} variant="h4" component="p">
          {Strings.messages.InstallationComplete}
        </Typography>
        <Typography classes={{ root: classes.finished_title }} variant="h5" component="p">
          {Strings.messages.AppNeedsReload}
        </Typography>
        <Button onClick={this.handleReload} 
          variant="contained" color="primary" size="large"
          className={classes.finished_button}
        >{normalizeGreek(Strings.titles.Reload)}</Button>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { pages: { stack, current }} = this.state;
    const page = current !== undefined && stack[current];

    return (
      <React.Fragment>
        <CssBaseline/>
        <div className={classes.container}>
          {this.renderHeader(page)}
          <section className={classes.section}>{this.renderContent(page)}</section>
          {this.renderFooter(page)}
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
    // display: 'flex',
    // position: 'relative',
    // flexDirection: 'row',
    // alignItems: 'center',
    // userSelect: 'none'
  },
  headerRow: {
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
    // justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: theme.spacing(1),
    '& > button': {
      marginLeft: theme.spacing(1)
    }
  },
  footerAddonButtons: {
    flex: 1
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

  selectNewType: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  selectNewType_longButtonRoot: {
    width: '44%',
    margin: theme.spacing(3, 0)
  },
  selectNewType_longButtonHeader: {
    marginBottom: theme.spacing(2)
  },
  selectNewType_longButtonContent: {
    textAlign: 'left'
  },
  selectNewType_description: {
    fontSize: '.9rem'
  },
  selectNewType_items: {
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
    width: '35%',
    flexDirection: 'column',
    padding: theme.spacing(2),
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
  },

  // Finished
  finished: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  finished_icon: {
    fontSize: 120,
    color: '#5bc35b',
    filter: 'drop-shadow(2px 8px 13px rgba(0,0,0,.3))'
  },
  finished_title: {
    lineHeight: 2
  },
  finished_button: {
    marginTop: 20
  }
});

export default hot(withStyles(styles)(Setup));
