import { Strings } from '@i18n';

export const success = (exp = {}) => ({ ok: true, ...exp });
export const fail = (exp = {}) => ({ ok: false, ...exp });
fail.internal = (internal, exp = {}) => fail({ internal, ...exp });

export const MsgTypes = {
  Info: 'info',
  Success: 'success',
  Question: 'question',
  Warning: 'warning',
  Error: 'error'
}

export const Errors = {
  IO: {
    __category: 'io',
    FileDoesNotExists: 1001
  },
  DB: {
    __category: 'db',
    InvalidConfig: 2001,
    CantConnect: 2002,
    FileDoesNotExists: 2003, // For SQLite
    NotInitialized: 2004,
    CantFetchData: 2005,
  },
  Config: {
    __category: 'config',
    InvalidFormat: 3001,
    FileDoesNotExists: 3002,
    InvalidPassword: 3003
  },
  Setup: {
    __category: 'setup',
    NewDBNotEmpty: 4001
  }
}

export function translateInternal(internal, ext = {}) {
  const { Warning } = MsgTypes;
  const { __category: io } = Errors.IO;
  const { __category: db } = Errors.DB;
  const { __category: config } = Errors.Config;
  const { __category: setup } = Errors.Setup;

  let res = [];

  console.log('internal', internal);

  const { code } = internal || {};

  console.log('internal', internal, code);

  switch(code) {
    // IO
    case Errors.IO.FileDoesNotExists:
      res = [Warning, Strings.messages.FileNotFound,, io];
      break;

    // DB
    case Errors.DB.InvalidConfig:
      res = [Warning, Strings.messages.DBConnectionNotValid,, db];
      break;
    case Errors.DB.CantConnect: {
      const { database } = internal || {};
      const message = database !== undefined ? 
        Strings.expand(Strings.messages.CantConnectToThisDB, internal) : 
        Strings.messages.DBCantConnect;

      res = [Warning, message,, db];
      break;
    }
    case Errors.DB.CantFetchData:
      res = [Warning, Strings.messages.CouldNotFetchData,, db];
      break;
    
    // Config
    case Errors.Config.InvalidFormat:
      res = [Warning, Strings.messages.NotValidConfigFile,, config];
      break;
    case Errors.Config.FileDoesNotExists:
      res = [Warning, Strings.messages.FileNotFound,, config];
      break;
    case Errors.Config.InvalidPassword:
      res = [Warning, Strings.titles.AccessDenied, Strings.messages.PasswordAppearsToBeWrong, config];
      break;
    
    // Setup
    case Errors.Setup.NewDBNotEmpty: {
      const message = Strings.expand(Strings.messages.NewDBNotEmpty);
      res = [Warning, message,, setup];
      break;
    }
  }

  if(res.length) {
    const [type, message, detail, category] = res;
    const title = errorTitle(category)
    return { type, message, category, title, detail, ...ext }
  }
}

export function errorTitle(category) {
  switch(category) {
    case 'io': return Strings.messages.DBProblem;
    case 'db': return Strings.messages.DBProblem;
    case 'config': return Strings.messages.ConfigProblem;
  }
}
