import fs from 'fs';
import { success, fail, Errors } from '@utils/errors';
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
      try {
        const cryptr = new Cryptr(secret);
        _ = JSON.parse(cryptr.decrypt(_));
      } catch(error) {
        return undefined;
      }
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

export function encryptDBProperties(data) {
  return encryptProperties(data, DBConfigEncryptedProps);
}

export function decryptDBProperties(data) {
  return decryptProperties(data, DBConfigEncryptedProps);
}

export function encodeDBConfig(data, {
  secret
} = {}) {
  return encodeConfigData(
    encryptDBProperties(data),
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
  const validateSig = bm.specs.bmcDBSignature;
  const decoded = decodeConfigData(data, { secret, validate, validateSig });

  if(decoded) {
    return decryptDBProperties(decoded);
  }
}

export function loadDBConfigFile(file, { secret } = {}) {
  if(!fs.existsSync(file)) {
    return fail.internal({ code: Errors.Config.FileDoesNotExists });
  }

  let contents;

  try {
    contents = fs.readFileSync(file);
  } catch(error) {
    return fail({ error });
  }

  try {
    const json = JSON.parse(contents);
    const { valid, encrypted } = isValidConfigData(json);

    if(valid) {
      let decoded;
      if(secret) {
        // console.log('loadDBConfigFile', secret, json);
        decoded = decodeDBConfig(json, { secret });
      } else if(!encrypted) {
        decoded = decodeDBConfig(json);
      } else {
        return success({ data: json, encrypted });
      }

      if(decoded) {
        const { data } = decoded;

        if(data && 'db' in data) {
          return success({ data });
        }
      }

      if(secret) {
        return fail.internal({ code: Errors.Config.InvalidPassword });
      } else {
        return fail.internal({ code: Errors.Config.InvalidFormat });
      }

        
      // } else {
      //   const { _ } = json;
      //   const { data } = _;
      //   return success({ data, encrypted });
      // }
    }

    return fail.internal({ code: Errors.Config.InvalidFormat });
  } catch(error) {
    console.log('error', JSON.stringify(error), error, error.code, error.message);
    return fail.internal({ code: Errors.Config.InvalidFormat }, { error });
  }
}
