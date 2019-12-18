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
  DB: {
    __category: 'db',
    InvalidConfig: 2001,
    CantConnect: 2002,
    FileDoesNotExists: 2003, // For SQLite
    NotInitialized: 2004
  }
}

export function translateInternal({ code }) {
  const { Warning } = MsgTypes;
  const { __category: db } = Errors.DB;
  let res = [];

  switch(code) {
    case Errors.DB.InvalidConfig:
      res = [Warning, Strings.messages.DBConnectionNotValid, db];
      break;
    case Errors.DB.CantConnect:
      res = [Warning, Strings.messages.DBCantConnect, db];
      break;
  }

  if(res.length) {
    const [type, message, category] = res;
    const title = errorTitle(category)
    return { type, message, category, title }
  }
}

export function errorTitle(category) {
  switch(category) {
    case 'db': return Strings.messages.DBProblem
  }
}
