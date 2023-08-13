const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET);
  } catch {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
