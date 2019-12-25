const {
  encodeConfigData,
  decodeConfigData
} = require('../src/utils/config');
const bm = require('../src/globals').default;

const secret = 'TestSecret1!';
const data = {
  db: {
    client: 'mysql',
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

    // console.log('encoded');
    // console.log(JSON.stringify(encoded));

    expect(encoded).toContainKey('_');
    expect(encoded._).toBeString();
    expect(encoded._).not.toBeEmpty();

    const decoded = decodeConfigData(encoded, { secret });

    expect(decoded).toContainKeys(['sig', 'data']);
    expect(decoded.sig).toBe(bm.specs.bmcSignature);
    expect(decoded.data).toEqual(data);
  });

  it('should decode pre-encoded data using secret key', () => {
    const preencoded = JSON.parse('{"_":"rn3AwfXTjJD8D3s4vpJj14tUUjpWHsq4BBv4v16JS4NU6A7BgttkEKAN7jv83gI9Q/Wb/50MObcZvMwSdwgtCzw3iLjQrKMc+x2pZv9a6P2vQ3uaEF3SeBm4o3EnPq9+rF8iWXgMWJsBOQuAkI1j05EgPXbMuB/IQv7iTiz0juQZqwD3EbxhcM28GyHpqTWBsTDJB7aKubUPpDduT1LEjgxeeDnjHUirSkwI4y80qfDSSaXUV6B0WllWmvDV6S8Hlx4C/Iz154KxOhh7gcVnJpFuAxj3zBABiqMo85KV4am/Q35c354OJYrra+Fr3JOZa/FFgudQWk6JYQ=="}');
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


