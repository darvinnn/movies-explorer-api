const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const BadRequestError = require('../errors/BadRequestError');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'verysecuredphrse';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Что-то не так с id пользователя'));
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((newUser) => {
          res.status(201).send({
            data: {
              name: newUser.name,
              about: newUser.about,
              avatar: newUser.avatar,
              email: newUser.email,
              _id: newUser._id,
            },
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

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new NotFoundError('Такого пользователя не существует');
      else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Что-то не так с id пользователя'));
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
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

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному id не найден');
      else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new AuthError('Некорректные данные пользователя'));
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthError('Неверный Email или пароль');
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) throw new AuthError('Неверный Email или пароль');
          const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
  JWT_SECRET,
};
