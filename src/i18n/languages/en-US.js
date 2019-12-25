export default {

  hello:'Hello!',
  howAreYou:'How Are You?',

  thisLanguage: 'English',
  languageFlagIso: 'us',
  languageEn: 'English',
  languageEl: 'Greek',
  euroSign: '€',

  titles: {
    Home: 'Home',
    Installation: 'Installation',
    Completed: 'Completed',
    Reload: 'Reload',
    Next: 'Next',
    Back: 'Back',
    Previous: 'Previous',
    Suggested: 'Suggested',
    Advanced: 'Advanced',
    DBType: 'Database type',
    Database: 'Database',
    User: 'User',
    Password: 'Password',
    Port: 'Port',
    OK: 'OK',
    Cancel: 'Cancel',
    File: 'File',

    Undo: 'Undo',
    Redo: 'Redo',
    Copy: 'Copy',
    Cut: 'Cut',
    Paste: 'Paste',
    SelectAll: 'Select all',

    NewInstallation: 'New installation',
    ConnectToExistingDB: 'Connect to existing database',
    ConnectToDB: 'Connect to database',
    ApplicationFunctions: 'Application functions',
    LocalDBInstallation: 'Local database installation',
    LocalInstallation: 'Local installation',
    DBConnectionSettings: 'Database connection settings',
    ConnectionSettings: 'Connection settings',
    FromConfigFile: 'From configuration file',
    ServerAddress: 'Server address',
    ConfigurationFilePassword: 'Configuration file password',
    DBConfigFile: 'Database configuration file',
    DBFile: 'Database file',
    TestConnection: 'Test connection',
    AccessDenied: 'Access denied',
  },

  messages: {
    StartupError: 'A startup error occurred',
    LoadingFileError: 'Error while loading file',
    DBProblem: 'Database problem',
    ConfigProblem: 'Configuration problem',
    IOProblem: 'Files system problem',
    DBConnectionNotValid: 'Database connection is not valid',
    DBCantConnect: 'Can\'t connect to the database',
    InputPasswordForProtectedConfigFile: 'Enter the password for the protected configuration file',
    FileNotFound: 'File not found',
    NotValidConfigFile: 'Not valid configuration file',
    PasswordAppearsToBeWrong: 'Password appears to be wrong',
    CouldNotFetchData: 'Could not fetch data',
    DBContainsAnInstallation: 'The database already contains an existing installation',
    DBNotEmpty: 'The database is not empty',
    MustSelectEmptyDBForNewInstallation: 'You must select an empty database for a new installation',
    DBFileExists: 'The database destination file already exists',
    CouldNotDeleteFile: 'Could not delete file',
    MakeSureDBExists: 'Make sure the database exists',
    InstallationComplete: 'Installation complete',
    AppNeedsReload: 'The application needs to be reloaded',
    CheckDBConnectionInfo: 'Check if you are connected to the database server network or that the database file exists',

    NewDBHasExisting: '{messages.DBContainsAnInstallation}.\n\n{prompts.CancelNewAndUseExistingInstallation}',
    NewDBNotEmpty: '{messages.DBNotEmpty}.\n\n{messages.MustSelectEmptyDBForNewInstallation}.',
    NewDBFileExists: '{messages.DBFileExists).\n\n{prompts.DeleteFileAndCreateNewDB}',
    CouldNotDeleteThisFile: '{messages.CouldNotDeleteFile}\n\n{file}',
    CantConnectToThisDB: '{messages.DBCantConnect} ({database})\n\n{messages.MakeSureDBExists}',
    CantConnectToDBCheckInfo: '{messages.DBCantConnect}.\n{messages.CheckDBConnectionInfo}.',
  },

  prompts: {
    CancelNewAndUseExistingInstallation: 'Cancel new installation and use existing one?',
    DeleteFileAndCreateNewDB: 'Are you sure you want to delete the file and create a new database?',
  },

  content: {
    ApplicationFunctions: {
      Personal: {
        Description: 'Contains functions for individual use such as:',
        Items: [
          'Contacts',
          'Personal Payroll',
          'Income / Expenses'
        ]
      },
      Business: {
        Description: 'For businesses with specialized functions such as:',
        // Test: '{titles.Password} {>Description} {~Personal.Items.1}',
        Items: [
          'Business Partners',
          'Invoices',
          'Products'
        ]
      },
    },
    DBInstallationType: {
      Local: {
        Description: 'The application will only run on this computer'
      },
      Advanced: {
        Description: 'Connect to other local or remote databases'
      }
    }
  },

  system: {
    fileDialog: {
      filters: {
        all: 'All files',
        bmc: 'Business Manager configuration files',
        sqlite: 'SQLite databases',
      }
    }
  }

}
