require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const Cryptr = require(path.resolve(process.env.LYXLIB_PATH, 'utils/cryptr.js'));



const key = crypto.randomBytes(16);
const secret = crypto.randomBytes(16);

console.log('sec:', secret.toString('hex'));

const cryptr_enc = new Cryptr(secret);
const enc = cryptr_enc.encrypt('This is a test!');

console.log(enc);

const cryptr_dec = new Cryptr(secret);
const dec = cryptr_dec.decrypt(enc);

console.log(dec);




// console.log(key.toString('hex'));
// console.log(key.toString('base64'));


