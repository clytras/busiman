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
    Next: 'Next',
    Back: 'Back',
    Previous: 'Previous',
    Suggested: 'Suggested',
    Advanced: 'Advanced',
    DBType: 'Database type',
    User: 'User',
    Password: 'Password',
    Port: 'Port',
    OK: 'OK',
    Cancel: 'Cancel',

    Undo: 'Undo',
    Redo: 'Redo',
    Copy: 'Copy',
    Cut: 'Cut',
    Paste: 'Paste',
    SelectAll: 'Select all',

    NewInstallation: 'New installation',
    ConnectToExistingDB: 'Connect to existing database',
    ApplicationFunctions: 'Application functions',
    LocalDBInstallation: 'Local database installation',
    LocalInstallation: 'Local installation',
    DBConnectionSettings: 'Database connection settings',
    ConnectionSettings: 'Connection settings',
    FromConfigFile: 'From configuration file',
    ServerAddress: 'Server address',
    ConfigurationFilePassword: 'Configuration file password',
  },

  messages: {
    StartupError: 'A startup error occurred',
    DBProblem: 'Database problem',
    DBConnectionNotValid: 'Database connection is not valid',
    DBCantConnect: 'Can\'t connect to the database',
    InputPasswordForProtectedConfigFile: 'Enter the password for the protected configuration file',
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
  }

}
