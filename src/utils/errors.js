export const success = (exp = {}) => ({ ok: true, ...exp });
export const fail = (exp = {}) => ({ ok: false, ...exp });
fail.internal = (internal, exp = {}) => fail({ internal, ...exp });

export const Errors = {
  DB: {
    InvalidConfig: 2001,
    CantConnect: 2002,
    FileDoesNotExists: 2003, // For SQLite
    NotInitialized: 2004
  }
}
