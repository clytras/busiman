import { Model } from 'objection';


export class Config extends Model {
  static get tableName() {
    return 'config';
  }

  $beforeInsert() {
    this.value = JSON.stringify(this.value);
  }

  $beforeUpdate() {
    this.value = JSON.stringify(this.value);
  }

  $parseDatabaseJson(json) {
    // Remember to call the super class's implementation.
    json = super.$parseDatabaseJson(json);
    // Do your conversion here.

    const { value } = json;

    if(typeof(value) === 'string') {
      try {
        json.value = JSON.parse(value);
      } catch {}
    }

    return json;
  }

  static async unset(key) {
    try {
      await this.query().delete().findOne('key', key);
      return true;
    } catch {
      return false;
    }
  }

  static async set(key, value) {
    try {
      // console.log('set', key, value);
      await this.query().insert({ key, value });
      return true;
    } catch(insertError) {
      // console.log('set error', error, JSON.stringify(error));

      try {
        await this.query().patch({ key, value });
        return true;
      } catch(updateError) {
        return false;
      }
    }
  }

  static async get(key, def) {
    try {
      // const { value } = await this.query().findOne('key', key);
      const row = await this.query().findOne('key', key);
      const { value } = row || {};

      if(value !== undefined) {
        return value;
      }
    } catch {}
    return def;
  }
}

export default function(knex) {
  return Config.bindKnex(knex);
}
