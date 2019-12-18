const {
  encrypt,
  decrypt,
  encryptProperties,
  decryptProperties
} = require('../src/utils/crypt');


describe('Encrypt / Decrypt', () => {
  const data = 'Testing utils crypt';
  const secret = 'TestSecret1!';

  it('should encrypt / decrypt string using general secret key', () => {
    const encoded = encrypt(data);

    expect(encoded).toBeString();
    expect(encoded).not.toBeEmpty();

    const decoded = decrypt(encoded);

    expect(decoded).toBe(data);
  });

  it('should encrypt / decrypt string using specific secret key', () => {
    const encoded = encrypt(data, secret);
    const encoded_gen = encrypt(data);

    expect(encoded).toBeString();
    expect(encoded).not.toBeEmpty();
    expect(encoded).not.toBe(encoded_gen);

    const decoded = decrypt(encoded, secret);

    expect(decoded).toBe(data);
  });

  it('should encrypt / decrypt specific object properties', () => {
    const props = ['password', 'nested'];
    const data = {
      user: 'User',
      password: 'Password',
      db: {
        newUser: 'User2',
        password: '',
        options: {
          name: 'Name',
          nested: {
            a: 1,
            s: 'S',
            arr: [1, 2, 3]
          }
        }
      }
    }

    const encoded = encryptProperties(data, props);

    expect(encoded).toHaveProperty('password');
    expect(encoded).toHaveProperty('db.password');
    expect(encoded).toHaveProperty('db.options.nested');
    expect(encoded.password).not.toBe(data.password);
    expect(encoded.db.password).not.toBe(data.db.password);
    expect(encoded.db.options.nested).not.toEqual(data.db.options.nested);

    const decoded = decryptProperties(encoded, props);

    expect(decoded).toHaveProperty('password', data.password);
    expect(decoded).toHaveProperty('db.password', data.db.password);
    expect(decoded).toHaveProperty('db.options.nested');
    expect(decoded.db.options.nested).toEqual(data.db.options.nested);
  });

});
