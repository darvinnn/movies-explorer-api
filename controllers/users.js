const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const BadRequestError = require('../errors/BadRequestError');
const { JWT_SECRET } = require('../utils/constants');

const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
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
      else {
        res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.codeName === 'DuplicateKey') return next(new BadRequestError('Такой email уже занят'));
      if (err.name === 'CastError') return next(new BadRequestError('Пользователь с указанным id не найден'));
      if (err.name === 'ValidationError') return next(new AuthError('Некорректные данные пользователя'));
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) throw new AuthError('Неверный Email или пароль');
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) throw new AuthError('Неверный Email или пароль');
          const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET, { expiresIn: '7d' });
          const userInfo = {
            name: user.name,
            email: user.email,
            _id: user._id,
          };
          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: 'none',
              Secure: true,
            })
            .send(userInfo);
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((newUser) => {
          res.status(201).send({
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') return next(new BadRequestError('Некорректные данные пользователя'));
          if (err.code === 11000) return next(new AlreadyExistsError('Пользователь с таким email уже зарегистрирован'));
          return next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getUser,
  updateUser,
  login,
  createUser,
};
