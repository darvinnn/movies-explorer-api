const { celebrate } = require('celebrate');

const router = require('express').Router();
const { createCardJoiValidation, changeCardJoiValidation } = require('../middlewares/JoiValidators');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
