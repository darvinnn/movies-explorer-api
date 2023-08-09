const { Joi } = require('celebrate');

const validationPattern = /^https?:\/\/([w]{3}\.)?[\w\d\-/#]+\.[\w\d\-/#]+/;

const updateUserJoiValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

const loginJoiValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const createUserJoiValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const createMovieJoiValidation = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(validationPattern),
    trailerLink: Joi.string().required().pattern(validationPattern),
    thumbnail: Joi.string().required().pattern(validationPattern),
    owner: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const deleteMovieJoiValidation = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  updateUserJoiValidation,
  loginJoiValidation,
  createUserJoiValidation,
  createMovieJoiValidation,
  deleteMovieJoiValidation,
};
