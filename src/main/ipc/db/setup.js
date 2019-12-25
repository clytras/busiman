import path from 'path';
import { ipcMain as ipc } from 'electron';
import { success, fail, Errors } from '@utils/errors';
import { DB } from '@db';
import { encryptDBProperties } from '@utils/config';


ipc.handle('setup.db.data', async (event, {
  config,
  mode
}) => {
  try {
    const { client } = config;
    const { connection } = config;
    const isNew = mode === 'new';
  
    const db = new DB({
      ...config,
      useNullAsDefault: true,
      migrations: {
        tableName: process.app.db.migrationsTableName,
        directory: path.resolve(process.app.db.migrationsPath, 'data')
      }
    });
  
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
  
      await process.app.config.set(
        'db.data.connection',
        encryptDBProperties(config)
      );
  
      return success();
    } else {
      return fail.internal({ code: Errors.DB.CouldNotFetchData });
    }
  } catch(error) {
    console.log('error', error);
    return fail({ error });
  }

});
