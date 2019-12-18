const {
  encodeConfigData,
  decodeConfigData
} = require('../src/utils/config');
const bm = require('../src/globals').default;

const secret = 'TestSecret1!';
const data = {
  db: {
    dialect: 'mysql',
    host: 'db.myhost.net',
    port: 3306,
    database: 'testing',
    user: 'test',
    password: '1234'
  }
}

describe('Config data encoding', () => {
  it('should encode/decode config data using secret key', () => {
    const encoded = encodeConfigData(data, { secret });

    expect(encoded).toContainKey('_');
    expect(encoded._).toBeString();
    expect(encoded._).not.toBeEmpty();

    const decoded = decodeConfigData(encoded, { secret });

    expect(decoded).toContainKeys(['sig', 'data']);
    expect(decoded.sig).toBe(bm.specs.bmcSignature);
    expect(decoded.data).toEqual(data);
  });

  it('should encode/decode config data without using secret key', () => {
    const encoded = encodeConfigData(data);

    expect(encoded).toContainKey('_');
    expect(encoded._).toBeObject();
    expect(encoded._).not.toBeEmpty();

    const decoded = decodeConfigData(encoded);

    expect(decoded).toContainKeys(['sig', 'data']);
    expect(decoded.sig).toBe(bm.specs.bmcSignature);
    expect(decoded.data).toEqual(data);
  });
});


