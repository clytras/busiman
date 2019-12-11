import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import knex from 'knex';


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

  async exists({
    keepConnection = true,
    validateConfig = true
  } = {}) {
    let result = false;
    let db;
    let testQuery = 'SELECT 1';

    const { _config: config } = this;

    if(validateConfig && !DB.validConfig(config)) {
      return false;
    }

    switch(this._config.client) {
      case 'oracle':
          testQuery = 'SELECT 1 FROM DUAL';
      case 'sqlite3':
      case 'sqlite':
        // try {
        //   const { filename } = this._config;
        //   if(fs.existsSync(filename)) {
        //     db = knex(this._config);
        //   }
        // } catch {}
        // break;
      case 'mysql':
      case 'mysql2':
      case 'mssql':
      case 'pg':
        try {
          db = knex(this._config);
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
    let result = {
      ok: false,
      supported: false
    }

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
          result = { ok: true, supported: true }
          console.warn('db.create:sqlite:ok?');
        } catch(error) {
          console.warn('db.create:sqlite:error', error);
          result = { ok: false, supported: true, error }
        }

        break;
      case 'oracle':
        result = { ok: false, supported: false }
        break;
      case 'mysql':
      case 'mysql2':
        try {
          let { host, user, password, database } = this._config || {};

          if(database) {
            try {
              db = knex({ host, user, password, database });
              await db.raw('SELECT 1');
              this.db = db;
              result = { ok: true, supported: true }
            } catch {
              try {
                db = knex({ host, user, password });
                await db.raw(`CREATE DATABASE \`${database}\``);
                this.db = db;
                result = { ok: true, supported: true }
              } catch(error) {
                result = { ok: false, supported: true, error }
              }
            }
          } else {
            result = { ok: false, supported: true }
          }
        } catch(error) {
          result = { ok: false, supported: true, error }
        }
        break;
      case 'mssql':
      case 'pg':
        result = { ok: false, supported: false }
        break;
    }

    return result;
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

