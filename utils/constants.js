const allowedCors = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://nikolaev-maxim-diplom.nomoreparties.co',
  'https://nikolaev-maxim-diplom.nomoreparties.co',
];
const DEV_DATABASE_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb';
const JWT_SECRET = 'verysecuredphrse';

module.exports = {
  allowedCors,
  DEV_DATABASE_URL,
  JWT_SECRET,
};
