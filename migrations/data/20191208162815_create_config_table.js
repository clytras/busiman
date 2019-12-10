exports.up = knex => knex.schema
.createTable('config', table => {
  table.increments('id');
  table.string('key');
  table.json('value');
  table.unique('key');
});

exports.down = knex => knex.schema
.dropTable('config');
