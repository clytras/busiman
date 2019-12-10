import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { app } from 'electron';
import { DB } from '../db';


export async function initApp() {
  const result = {
    ok: false
  }

  // Create userData directory
  if(!fs.existsSync(app.getPath('userData'))) {
    try {
      fs.mkdirSync(app.getPath('userData'), )
    } catch(error) {
      if(error.code !== 'EEXIST') {
        return { ok: false, error }
      }
    }
  }

  console.log('process.app.dataPath', process.app.dataPath);
  console.log('process.app', process.app);

  try {
    fs.mkdirSync(process.app.dataPath, { recursive: true });
  } catch {}

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
      tableName: process.app.db.migrationsName,
      directory: path.resolve(process.app.db.migrationsPath, 'app')
    }
  });

  try {
    if(!await process.app.db.app.exists()) {
      await process.app.db.app.create();
    }
    await process.app.db.app.migrate();

    console.log('migrate done?');

    return { ok: true }
  } catch(error) {
    console.warn('create/migrate db error', error);
    return { ok: false, error }
  }

}
