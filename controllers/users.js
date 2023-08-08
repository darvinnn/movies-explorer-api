const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const BadRequestError = require('../errors/BadRequestError');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'verysecuredphrse';

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.status(200).send(user))
    .catch((err) => (err.name === 'CastError' ? next(new BadRequestError('Что-то не так с id пользователя')) : next(err)));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Такого пользователя не существует');
      else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Пользователь с указанным id не найден'));
      if (err.name === 'ValidationError') return next(new AuthError('Некорректные данные пользователя'));
      return next(err);
    });
};

module.exports = {
  getUser,
  updateUser,
};
