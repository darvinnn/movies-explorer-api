const { celebrate } = require('celebrate');

const router = require('express').Router();
const { createMovieJoiValidation, deleteMovieJoiValidation } = require('../middlewares/JoiValidators');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate(createMovieJoiValidation), createMovie);
router.delete('/:id', celebrate(deleteMovieJoiValidation), deleteMovie);

module.exports = router;
