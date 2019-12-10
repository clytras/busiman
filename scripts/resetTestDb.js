require('colors');
const path = require('path');
const config = require('../knexfile').test;

const schemas = {
  app: require('knex')(config.app),
  data: require('knex')(config.data)
}

main();

async function main() {
  async function migrate(db) {
    // Expecting SQLite db for testing, thus getting the filename for db name
    const name = path.basename(db.client.config.connection.filename);
    const [completed] = await db.migrate.list();

    if(completed.length) {
      console.log(` "${name.magenta}" has ${`${completed.length}`.cyan} completed migrations; rolling back...`);
      await db.migrate.rollback();
    }

    const [, pending] = await db.migrate.list();

    if(pending.length) {
      console.log(` "${name.magenta}" has ${`${pending.length}`.cyan} pending migrations; migrating...`);
      await db.migrate.latest();
    }
  }

  Promise.all([
    migrate(schemas.app), 
    migrate(schemas.data)
  ]).finally(() => {
    schemas.app.destroy();
    schemas.data.destroy();
  });
}

