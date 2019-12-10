require('dotenv').config();
const path = require('path');


module.exports = {
  test: {
    app: {
      debug: false,
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, 'db/app.test.db')
      },
      useNullAsDefault: true,
      migrations: {
        stub: 'migrations.stub',
        tableName: 'migrations',
        directory: 'migrations/app'
      }
    },
    data: {
      debug: false,
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, 'db/data.test.db')
      },
      pool: {
        min: 2,
        max: 10
      },
      useNullAsDefault: true,
      migrations: {
        stub: 'migrations.stub',
        tableName: 'migrations',
        directory: 'migrations/data'
      }
    }
  }
}
