const { Joi } = require('celebrate');

const validationPattern = /^https?:\/\/([w]{3}\.)?[\w\d\-/#]+\.[\w\d\-/#]+/;

const getUserByIdJoiValidation = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const updateUserJoiValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(20).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};

const updateAvatarJoiValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(validationPattern).required(),
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
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(20),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(validationPattern),
  }),
};

const createCardJoiValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(validationPattern).required(),
  }),
};

const changeCardJoiValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  getUserByIdJoiValidation,
  updateUserJoiValidation,
  updateAvatarJoiValidation,
  loginJoiValidation,
  createUserJoiValidation,
  createCardJoiValidation,
  changeCardJoiValidation,
};
