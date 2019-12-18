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

    console.log('encoded');
    console.log(JSON.stringify(encoded));

    expect(encoded).toContainKey('_');
    expect(encoded._).toBeString();
    expect(encoded._).not.toBeEmpty();

    const decoded = decodeConfigData(encoded, { secret });

    expect(decoded).toContainKeys(['sig', 'data']);
    expect(decoded.sig).toBe(bm.specs.bmcSignature);
    expect(decoded.data).toEqual(data);
  });

  it('should decode pre-encoded data using secret key', () => {
    const preencoded = JSON.parse('{"_":"O8BuIt0IBchZ1SrLmNR+lh3rHiVUOTjKK6/ICWSH/fmWT/II87A9pPXjrdiS0dVcNjCRO/dxNTf0mvVpqlz2RpMqCGqIibG+ZQT6WbYZ619j1d13+d5JVhSFXwqdi0Ulmu2U7I8WwcH35n7Awz5WOQRsuxDCXAJ0npx77FQEKIMJMnAjVIWKjWtK93LbA+P4cq8GaG81yuOY+v7TkoGQ3sglOWRUG66gkTjvr8Jq0kXmhRZYYksiKH3zq1JY+XL9E/Blngm/7Eg/ukg1Oo7FO/S5nftaOkVVpDEs7ZMxo+FTuPYQmT6hgx4z5fdKj1c3YEY3TwIRUA45eVU="}');
    const decoded = decodeConfigData(preencoded, { secret });

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


