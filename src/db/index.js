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

  async hasMigrationTable() {
    const { ok, error, tables = [] } = await this.listTables();
    let result = false;

    if(ok) {
      const { migrations: { tableName } = {}} = this._config;

      if(tableName) {
        const found = [tableName, `${tableName}_lock`]
        .reduce((acc, table) => tables.indexOf(table) !== -1 ? ++acc : acc, 0);
        result = found === 2;
      }
    }

    return { result, tables }
  }

  async listTables({ excludeDefaults = true } = {}) {
    try {
      let rows;
      let tables = [];
  
      switch(this._config.client) {
        case 'mssql': {
          // query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
          // bindings = [ this.db.client.database() ];
          const result = await this.db
          .from('information_schema.tables')
          .select('table_name')
          .where('table_schema', 'public')
          .where('table_catalog', this.db.client.database());

          rows = result;
          break;
        }
        case 'mysql':
        case 'mysql2': {
          // const query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
          // const bindings = [ this.db.client.database() ];
          const result = await this.db
          .from('information_schema.tables')
          .select('table_name')
          .where('table_schema', this.db.client.database());

          rows = result;
          break;
        }
        case 'oracle': {
          // query = 'SELECT table_name FROM user_tables';
          const result = await this.db
          .from('user_tables')
          .select('table_name');

          rows = result;
          break;
        }
        case 'pg':
          // query =  'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
          // bindings = [ this.db.client.database() ];
          // const result = await this.db
          // .from('information_schema.tables')
          // .select('table_name')
          // .where('table_schema', this.db.client.database());

          const result = await this.db
          .from('pg_catalog.pg_tables')
          .select('tablename')
          .where('schemaname', this.db.client.database());

          rows = result;
          break;
        case 'sqlite':
        case 'sqlite3': {
          // query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
          
          const result = await this.db
          .from('sqlite_master')
          .select('name as table_name')
          .where('type', 'table');

          if(result.length > 0 && excludeDefaults) {
            rows = result.filter(({ table_name }) => table_name !== 'sqlite_sequence');
          } else {
            rows = result;
          }
          break;
        }
      }

      if(rows && rows.length) {
         tables = rows.map(({ table_name }) => table_name);
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

    if(this.db) {
      try {
        this.db.destroy();
      } catch {}
      this.db = null;
    }

    switch(this._config.client) {
      case 'sqlite3':
      case 'sqlite':
        const { filename } = this._config.connection;
        const location = path.dirname(filename);

        if(!fs.existsSync(location)) {
          fs.mkdirSync(location, { recursive: true, mode: 764 });
        }

        try {
          db = knex(this._config);
          await db.raw('SELECT 1'); // it has to execute a single query to create the db file
          this.db = db;
          console.warn('db.create:sqlite:ok?');
          return success({ supported: true });
        } catch(error) {
          console.warn('db.create:sqlite:error', error);
          return fail({ supported: true, error });
        }
        break;
      case 'oracle':
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
              return success({ supported: true });
            } catch {
              try {
                db = knex({ host, user, password });
                await db.raw(`CREATE DATABASE \`${database}\``);
                this.db = db;
                return success({ supported: true });
              } catch(error) {
                return fail({ supported: true, error });
              }
            }
          } else {
            return fail({ supported: true });
          }
        } catch(error) {
          return fail({ supported: true, error });
        }
        break;
      case 'mssql':
      case 'pg':
        break; // to fail unsuported
    }

    return fail({ supported: false });
  }

  async open() {
    if(await this.exists()) {
      return true;
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

