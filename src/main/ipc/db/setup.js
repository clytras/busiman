import path from 'path';
import { ipcMain as ipc } from 'electron';
import { success, fail, Errors } from '@utils/errors';
import { DB, isDBTypeSQLite } from '@db';
import { encryptDBProperties } from '@utils/config';

async function saveDBConfig(config) {
  return await process.app.config.set(
    'db.data.connection',
    encryptDBProperties(config)
  );
}

ipc.handle('setup.db.data', async (event, {
  config,
  mode
}) => {
  try {
    const { client } = config;
    const { connection } = config;
    const isNew = mode === 'new';
    const isExisting = mode === 'existing';
    const isError = mode === 'error';
  
    const db = new DB({
      ...config,
      useNullAsDefault: true,
      migrations: {
        tableName: process.app.db.migrationsTableName,
        directory: path.resolve(process.app.db.migrationsPath, 'data')
      }
    });
  
    console.log('setup.db.data config', config);

    if(isNew && isDBTypeSQLite(client)) {
      const { ok, error } = await db.create();

      console.log('setup.db.data create', ok, error);

      if(!ok) {
        return fail.internal({ code: Errors.DB.CouldNotCreateFile, error });
      }
    }

    const canConnect = await db.exists({
      keepConnection: false,
      validateConfig: true,
      useDatabase: false
    });
  
    if(!canConnect) {
      return fail.internal({ code: Errors.DB.CantConnect });
    }
  
    const exists = await db.exists();
  
    if(!exists) {
      let { database } = connection;
      if(!database) database = connection.filename;
  
      return fail.internal({ code: Errors.DB.CantConnect, database });
    }
  
    if(isNew) {
      const { ok, tables } = await db.listTables();
  
      if(ok) {
        if(tables.length > 0) {
          return fail.internal({ code: Errors.Setup.NewDBNotEmpty });
        }
      } else {
        return fail.internal({ code: Errors.DB.CouldNotFetchData });
      }
    } else {
      const { result: itHasMigrations, tables } = await db.hasMigrationTable();

      if(itHasMigrations) {
        // console.log('db.data.connection mig.set', await saveDBConfig(config));
        if(!isError) {
          await saveDBConfig(config);
        }
        return success();
      }

      if(tables.length) {
        return fail.internal({ code: Errors.DB.InvalidData });
      }
      
      return fail.internal({ code: Errors.DB.NotInitialized });
    }
  
    // migrate
    const { ok, migrations } = await db.listMigrations();
  
    if(ok) {
      console.log('ok mig', migrations);
  
      const [complete, pending] = migrations;
  
      // if(isNew) {
      //   if(complete.length > 0) {
      //     const result = MsgBox.show({
      //       type: 'question',
      //       buttons: MsgBox.Buttons.YesNo,
      //       message: Strings.expand(Strings.messages.NewDBHasExisting)
      //     }, 'current');
  
      //     if(result === 1) { // No, don't use existing
      //       return;
      //     }
      //   }
      // }
  
      if(pending.length > 0) {
        await db.migrate();
      }
  
      console.log('db.data.connection set', await saveDBConfig(config));
  
      return success();
    } else {
      return fail.internal({ code: Errors.DB.CouldNotFetchData });
    }
  } catch(error) {
    console.log('error', error);
    return fail({ error });
  }

});
