import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { app } from 'electron';
import { success, fail, Errors } from '@utils/errors';
import { decryptDBProperties } from '@utils/config';
import { DB } from '@db';
import { Config } from '@db/models/Config';


export async function initApp() {
  try {
    fs.mkdirSync(process.app.dataPath, { recursive: true });
  } catch(error) {
    const { code } = error || {};
    if(code && code !== 'EEXIST') {
      return fail({ error });
    }
  }

  try {
    await fse.copy(
      path.join(app.getAppPath(), process.app.db.migrationsName),
      process.app.db.migrationsPath,
      {
        overwrite: false,
        errorOnExist: false
      }
    );
  } catch {}

  process.app.db.app = new DB({
    client: 'sqlite3',
    connection: {
      filename: process.app.db.appFile
    },
    useNullAsDefault: true,
    migrations: {
      tableName: process.app.db.migrationsTableName,
      directory: path.resolve(process.app.db.migrationsPath, 'app')
    }
  });

  try {
    if(!await process.app.db.app.exists()) {
      await process.app.db.app.create();
    }
    await process.app.db.app.migrate();

    console.log('migrate done?');

    process.app.config = Config.bindKnex(process.app.db.app.db);

    const dataConnection = await process.app.config.get('db.data.connection');

    if(!dataConnection) {
      return fail.internal({
        code: Errors.DB.NotInitialized
      });
    }

    process.app.db.dataConnection = decryptDBProperties(dataConnection);

    if(!DB.validConfig(process.app.db.dataConnection, { mustHaveDatabase: true })) {
      return fail.internal({
        code: Errors.DB.InvalidConfig
      });
    }

    process.app.db.data = new DB({
      ...process.app.db.dataConnection,
      useNullAsDefault: true,
      migrations: {
        tableName: process.app.db.migrationsName,
        directory: path.resolve(process.app.db.migrationsPath, 'data')
      }
    });

    if(!await process.app.db.data.exists()) {
      return fail.internal({
        code: Errors.DB.CantConnect
      })
    }

    return success();
  } catch(error) {
    console.warn('create/migrate db error', error);
    return fail({ error });
  }
}
