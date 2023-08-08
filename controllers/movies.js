const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies.reverse()))
    .catch(next);
};

const createMovie = (req, res, next) => {
  console.log(req.body);
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Такого фильма не существует');
      else if (movie.owner.toString() !== req.user._id) throw new ForbiddenError('У вас нет прав для удаления фильма');
      else {
        Movie.deleteOne(movie)
          .then((deletedMovie) => res.status(200).send(deletedMovie))
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
