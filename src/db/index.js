import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import knex from 'knex';
import { success, fail } from '@utils/errors';


export const isDBTypeSQLite = t => /^sqlite[3]?$/i.test(t);
export const isDBTypeMySQL = t => /^mysql[2]?$/i.test(t);
export const isDBTypeMSSQL = t => /^mssql$/i.test(t);
export const isDBTypeOracle = t => /^oracle$/i.test(t);
export const isDBTypePostgre = t => /^pg$/i.test(t);
export const isDBTypeSupported = t => /^(sqlite[3]?|mysql[2]?|mssql|oracle|pg)$/i.test(t);

export class DB {
  _config = {};
  meta = null;
  db = null;

  constructor(config) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set config(config) {
    this._config = {...config}
  }

  static validConfig(config, {
    mustHaveDatabase = false
  } = {}) {
    let result = false;
    const { client, connection } = config || {};

    switch(client) {
      case 'sqlite3':
      case 'sqlite':
        const { filename } = connection || {};
        result = !!filename;
        break;
      case 'oracle':
      case 'mysql':
      case 'mysql2':
      case 'pg':
      case 'mssql':
        const { host, server, domain, user, database } = connection || {};
        if(user && (host || server || domain)) {
          if(mustHaveDatabase) {
            result = !!database;
          } else {
            result = true;
          }
        }
        break;
    }

    return result;
  }

  async listMigrations() {
    try {
      const migrations = await this.db.migrate.list();
      return success({ migrations });
    } catch(error) {
      return fail({ error });
    }
  }

  async listTables() {
    try {
      let query;
      let bindings;
  
      switch(this._config.client) {
        case 'mssql':
          query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
          bindings = [ this.db.client.database() ];
          break;
        case 'mysql':
        case 'mysql2':
          query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
          bindings = [ this.db.client.database() ];
          break;
        case 'oracle':
          query = 'SELECT table_name FROM user_tables';
          break;
        case 'pg':
          query =  'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
          bindings = [ this.db.client.database() ];
          break;
        case 'sqlite':
        case 'sqlite3':
          query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
          break;
      }

      const result = await this.db.raw(query, bindings);
      let tables = [];

      if(result) {
        let { rows } = result;
        if(!rows && Array.isArray(result)) {
          rows = result[0];
        }
        if(rows) {
          tables = rows.map(row => row.table_name);
        }
      }

      return success({ tables });
    } catch(error) {
      return fail({ error });
    }
}

  async exists({
    keepConnection = true,
    validateConfig = true,
    useDatabase = true
  } = {}) {
    let result = false;
    let db;
    let testQuery = 'SELECT 1';

    const config = { ...this._config };

    if(!useDatabase && config && 'database' in config) {
      delete config.database;
    }

    if(validateConfig && !DB.validConfig(config)) {
      return false;
    }

    const { client, connection = {}} = config || {};

    switch(client) {
      case 'oracle':
          testQuery = 'SELECT 1 FROM DUAL';
      case 'sqlite3':
      case 'sqlite':
        try {
          const { filename } = connection;
          if(!fs.existsSync(filename)) {
            return false;
          }
        } catch {}
      case 'mysql':
      case 'mysql2':
      case 'mssql':
      case 'pg':
        try {
          db = knex(config);
        } catch {}
        break;
      default:
        return false;
    }

    if(db) {
      try {
        await db.raw(testQuery);

        if(keepConnection) {
          console.log('keeping connection', this.db);
          if(this.db) {
            try {
              this.db.destroy();
            } catch {}
          }

          this.db = db;
        } else {
          db.destroy();
        }
        result = true;
      } catch {}
    }

    return result;
  }

  async create() {
    let db;
    // let result = {
    //   ok: false,
    //   supported: false
    // }

    if(this.db) {
      try {
        this.db.destroy();
      } catch {}
      this.db = null;
    }

    // console.log('db.create', this._config);

    switch(this._config.client) {
      case 'sqlite3':
      case 'sqlite':
        const { filename } = this._config.connection;
        const location = path.dirname(filename);

        // console.log('db.create:sqlite', this._config, filename, location);

        if(!fs.existsSync(location)) {
          fs.mkdirSync(location, { recursive: true, mode: 764 });
        }

        try {
          db = knex(this._config);
          console.warn('db.create:sqlite:ok?');
          return success({ supported: true });
        } catch(error) {
          console.warn('db.create:sqlite:error', error);
          // result = { ok: false, supported: true, error }
          return fail({ supported: true, error });
        }
        break;
      case 'oracle':
        // result = { ok: false, supported: false }
        break; // to fail unsuported
      case 'mysql':
      case 'mysql2':
        try {
          let { host, user, password, database } = this._config || {};

          if(database) {
            try {
              db = knex({ host, user, password, database });
              await db.raw('SELECT 1');
              this.db = db;
              // result = { ok: true, supported: true }
              return success({ supported: true });
            } catch {
              try {
                db = knex({ host, user, password });
                await db.raw(`CREATE DATABASE \`${database}\``);
                this.db = db;
                // result = { ok: true, supported: true }
                return success({ supported: true });
              } catch(error) {
                // result = { ok: false, supported: true, error }
                return fail({ supported: true, error });
              }
            }
          } else {
            //result = { ok: false, supported: true }
            return fail({ supported: true });
          }
        } catch(error) {
          // result = { ok: false, supported: true, error }
          return fail({ supported: true, error });
        }
        break;
      case 'mssql':
      case 'pg':
        // result = { ok: false, supported: false }
        break; // to fail unsuported
    }

    return fail({ supported: false });

    // return result;
  }

  async open() {
    if(await this.exists()) {
      return true;
      // try {
      //   const { count } = this.db(process.app.db.migrationsName).count('id').first();
      //   console.log('count', JSON.stringify(count));
      // } catch(error) {
      //   console.warn('cant get migrations count', JSON.stringify(error));
      // }
    }
    
    return false;
  }

  close() {
    try {
      if(this.db) {
        this.db.destroy();
      }
      this.db = null;
    } catch {}
  }

  async migrate() {
    try {
      await this.db.migrate.latest();
      return { ok: true }
    } catch(error) {
      return { ok: false, error }
    }
  }
}

