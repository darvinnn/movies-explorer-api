require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorsHandler = require('./middlewares/errorsHandler');
const cors = require('./middlewares/CORS');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const routes = require('./routers/index');
const limiter = require('./middlewares/rateLimiter');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors);
app.use(requestLogger);
app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb');

app.listen(3000);
