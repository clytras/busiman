import Cryptr from 'lyxlib/utils/cryptr';
import bm from '@app/globals';


export function encrypt(data, secret) {
  const cryptr = new Cryptr(secret || bm.keys.genEnc);
  return cryptr.encrypt(data);
}

export function decrypt(data, secret) {
  const cryptr = new Cryptr(secret || bm.keys.genEnc);
  return cryptr.decrypt(data);
}

export function encryptProperties(data, props, secret) {
  if(typeof(data) !== 'object') {
    const type = typeof(data);
    throw new Error(`encryptProperties dataObject must be an object; '${type}' given`);
  }

  if(!props || !props.length) {
    return data;
  }

  const result = {}
  const cryptr = new Cryptr(secret || bm.keys.genEnc);

  for(let key in data) {
    let value;

    if(typeof(data[key]) === 'object' && !Array.isArray(data[key])) {
      value = encryptProperties(data[key], props, secret);
    } else {
      value = data[key];
    }

    if((typeof(props) === 'string' && (props === key || props === '*')) ||
       (Array.isArray(props) && props.indexOf(key) !== -1)
    ) {
      value = cryptr.encrypt(JSON.stringify(value));
    }

    result[key] = value;
  }

  return result;
}

export function decryptProperties(data, props, secret) {
  if(typeof(data) !== 'object') {
    const type = typeof(data);
    throw new Error(`encryptProperties dataObject must be an object; '${type}' given`);
  }

  if(!props || !props.length) {
    return data;
  }

  const result = {}
  const cryptr = new Cryptr(secret || bm.keys.genEnc);

  for(let key in data) {
    let value;

    if(typeof(data[key]) === 'object' && !Array.isArray(data[key])) {
      value = decryptProperties(data[key], props, secret);
    } else {
      value = data[key];
    }

    if((typeof(props) === 'string' && (props === key || props === '*')) ||
       (Array.isArray(props) && props.indexOf(key) !== -1)
    ) {
      value = JSON.parse(cryptr.decrypt(value));
    }
    
    result[key] = value;
  }

  return result;
}
