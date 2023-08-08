require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const usersRoute = require('./routers/users');
const cardsRoute = require('./routers/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const NotFoundError = require('./errors/NotFoundError');
const { loginJoiValidation, createUserJoiValidation } = require('./middlewares/JoiValidators');
const cors = require('./middlewares/CORS');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP to 400 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.use(limiter); // Я не понял замечания. Стоит удалить лимитер?
app.post('/signin', celebrate(loginJoiValidation), login);
app.post('/signup', celebrate(createUserJoiValidation), createUser);
app.use(auth);
app.use('/users', usersRoute);
app.use('/cards', cardsRoute);
app.use('/*', (req, res, next) => { next(new NotFoundError('Такой страницы не существует')); });

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3000);
