const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies.reverse()))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const data = { ...req.body, owner: req.user._id };
  Movie.create(data)
    .then((movie) => res.status(201).send(movie))
    .catch((err) => (err.name === 'ValidationError' ? next(new AuthError('Некорректные данные пользователя')) : next(err)));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      console.log('found movie:', movie);
      if (!movie) throw new NotFoundError('Такого фильма не существует');
      else if (movie.owner.toString() !== req.user._id) throw new ForbiddenError('У вас нет прав для удаления фильма');
      else {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send(movie))
          .catch(next);
      }
    })
    .catch((err) => (err.name === 'CastError' ? next(new BadRequestError('Что-то не так с id фильма')) : next(err)));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
