import Cryptr from 'lyxlib/utils/cryptr';
import { encryptProperties, decryptProperties } from '@utils';
import bm from '@app/globals';


export function encodeConfigData(data, {
  secret,
  version
} = {}) {
  const sig = bm.specs.bmcSignature;
  let _ = { sig, data }

  if(secret) {
    const cryptr = new Cryptr(secret);
    _ = cryptr.encrypt(JSON.stringify(_));
  }

  return version ? { version, _ } : { _ }
}

export function decodeConfigData(data, {
  secret,
  validate = true
} = {}) {
  if('_' in data) {
    let { version, _ } = data;

    if(secret) {
      const cryptr = new Cryptr(secret);
      _ = JSON.parse(cryptr.decrypt(_));
    }

    if(typeof(_) === 'object') {
      if(validate) {
        if('sig' in _ && 'data' in _) {
          const { data, ...rest } = _;
          return version !== undefined ? { version, ...rest, data } : { ...rest, data }
        }
      } else {
        return { ..._ }
      }
    }
  }
}

const DBConfigEncryptedProps = ['password', 'user', 'database', 'host', 'port'];

export function encodeDBConfig(data, {
  secret
} = {}) {
  return encodeConfigData(
    encryptProperties(data, DBConfigEncryptedProps), {
      secret
    }
  );
}

export function decodeDBConfig(data, {
  secret
} = {}) {
  return decryptProperties(
    decodeConfigData(data, { secret }),
    DBConfigEncryptedProps
  );
}
