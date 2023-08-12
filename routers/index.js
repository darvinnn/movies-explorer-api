const { celebrate } = require('celebrate');
const router = require('express').Router();
const { loginJoiValidation, createUserJoiValidation } = require('../middlewares/JoiValidators');
const NotFoundError = require('../errors/NotFoundError');
const usersRoute = require('./users');
const moviesRoute = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate(loginJoiValidation), login);
router.post('/signup', celebrate(createUserJoiValidation), createUser);
router.post('/logout', (req, res) => res.clearCookie('jwt').end());
router.use(auth);
router.use('/users', usersRoute);
router.use('/movies', moviesRoute);
router.use('/*', (req, res, next) => next(new NotFoundError('Такой страницы не существует')));

module.exports = router;
