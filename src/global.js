import path from 'path';
import { app } from 'electron';

app.setPath('userData', path.join(app.getPath('appData'), PACKAGE.shortName));

const dataPath = path.join(app.getPath('userData'), 'Data');
const migrationsName = 'migrations';
const migrationsTableName = `bm_${migrationsName}`;

process.app = {
  package: PACKAGE,
  dataPath,
  db: {
    app: null,
    data: null,
    appFile: path.join(dataPath, `${PACKAGE.name}.db`),
    dataConnection: {},
    dataDefaultSQLiteFile: path.join(dataPath, `${PACKAGE.name}.data.db`),
    dataDefaultDatabaseName: PACKAGE.name,
    migrationsName,
    migrationsTableName,
    migrationsPath: path.join(dataPath, migrationsName)
  },
  system: {
    hasAppDb: false,
    hadDataDb: false
  },
  config: null
}
