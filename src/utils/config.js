import Cryptr from 'lyxlib/utils/cryptr';
import { encryptProperties, decryptProperties } from '@utils/crypt';
import bm from '@app/globals';


export function encodeConfigData(data, {
  secret,
  version,
  sig = bm.specs.bmcSignature
} = {}) {
  let _ = { sig, data }

  if(secret) {
    const cryptr = new Cryptr(secret);
    _ = cryptr.encrypt(JSON.stringify(_));
  }

  return version ? { version, _ } : { _ }
}

export function decodeConfigData(data, {
  secret,
  validate = true,
  validateSig = bm.specs.bmcSignature
} = {}) {
  if('_' in data) {
    let { version, _ } = data;

    if(secret) {
      const cryptr = new Cryptr(secret);
      _ = JSON.parse(cryptr.decrypt(_));
    }

    if(typeof(_) === 'object') {
      if(validate) {
        if('sig' in _ && 'data' in _ && _.sig === validateSig) {
          const { data, ...rest } = _;
          return version !== undefined ? { version, ...rest, data } : { ...rest, data }
        }
      } else {
        return { ..._ }
      }
    }
  }
}

export function isValidConfigData(data) {
  let valid = false, encrypted;

  if('_' in data) {
    const { _ } = data;

    if(typeof(_) === 'string') {
      valid = true;
      encrypted = true;
    } else if(typeof(_) === 'object') {
      const { sig, data } = _ || {};

      if(sig && data) {
        valid = true;
        encrypted = false;
      }
    }
  }

  return { valid, encrypted }
}

const DBConfigEncryptedProps = ['password', 'user', 'database', 'host', 'port'];

export function encodeDBConfig(data, {
  secret
} = {}) {
  return encodeConfigData(
    encryptProperties(data, DBConfigEncryptedProps),
    {
      secret,
      sig: bm.specs.bmcDBSignature
    }
  );
}

export function decodeDBConfig(data, {
  secret,
  validate = true
} = {}) {
  return decryptProperties(
    decodeConfigData(data, { secret, validate, validateSig: bm.specs.bmcDBSignature }),
    DBConfigEncryptedProps
  );
}
