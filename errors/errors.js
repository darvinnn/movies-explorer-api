const BAD_REQUEST = 400;
// const NOT_FOUND = 404;
const DEFAULT = 500;

const badRequestMessage = {
  message: 'Переданы некорректные данные',
};

// const notFoundMessage = {
//   message: 'Данные не найдены',
// };

const defaultErrorMessage = {
  message: 'Произошла ошибка',
};

const isCastError = (err, res) => {
  if (err.name === 'CastError') {
    res.status(BAD_REQUEST).send(badRequestMessage);
  } else {
    res.status(DEFAULT).send(defaultErrorMessage);
  }
};

const isValidationError = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send(badRequestMessage);
  } else {
    res.status(DEFAULT).send(defaultErrorMessage);
  }
};

module.exports = {
  isCastError,
  isValidationError,
};
