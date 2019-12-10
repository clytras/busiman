require('colors');
const path = require('path');
const config = require('../knexfile').test;

const schemas = {
  app: require('knex')(config.app),
  data: require('knex')(config.data)
}

const { Model } = require('objection');

// Set default schema
Model.knex(schemas.data);

// const AppConfigBind = require('../src/db/models/Config.js');
const { Config } = require('../src/db/models/Config.js');

// Set app schema for AppConfig
const AppConfig = Config.bindKnex(schemas.app);


const makekey = type => `test.${type}.string.${(new Date).getTime()}`;
const testConfig = (model, title) => 
  describe(`${title} (set/get/def/unset) [db.models.Config]`, () => {

    const testWith = (type, value, def) => 
      it(`should write/read/default/delete ${type}`, async () => {
        const key = makekey(type);

        const setResult = await model.set(key, value);
        expect(setResult).toBeTruthy();

        const getValue = await model.get(key);
        expect(getValue).toStrictEqual(value);

        const unsetResult = await model.unset(key);
        expect(unsetResult).toBeTruthy();

        const defValue = await model.get(key, def);
        expect(defValue).toStrictEqual(def);
      });

    const defVal = 'DEFAULT VALUE';

    testWith('string', 'config test write', defVal);
    testWith('int', 123, defVal);
    testWith('float', 1.23, defVal);
    testWith('boolean', true, defVal);
    testWith('object', { test: { obj: { val: 'Val' }}}, defVal);
    testWith('array', [1, 2, 3], defVal);

  });

testConfig(AppConfig, 'App Config');
testConfig(Config, 'Data Config');

afterAll(() => {
  schemas.app.destroy();
  schemas.data.destroy();
});
