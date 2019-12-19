import path from 'path';
import fs from 'fs';
import {
  encodeDBConfig
} from '../src/utils/config';

const outpurDir = path.resolve(__dirname, '../trials/config');
const secret = 'TestingPWD!';

const configs = [{
  file: 'local-mysql.bmc',
  data: {
    db: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'testing'
    }
  }
}, {
  file: 'local-mssql.bmc',
  data: {
    db: {
      host: 'ZKRHC',
      user: 'sa',
      password: 'root',
      database: 'test'
    }
  }
}];

for(let { file, data } of configs) {
  const encoded = encodeDBConfig(data);
  const encodedWithSecret = encodeDBConfig(data, { secret });

  fs.writeFileSync(path.resolve(outpurDir, file), JSON.stringify(encoded));
  console.log(`written db config: '${file}'`);

  const filename = `encrypted-${file}`;
  fs.writeFileSync(path.resolve(outpurDir, filename), JSON.stringify(encodedWithSecret));
  console.log(`written encrypted db config: '${filename}'`);
}

