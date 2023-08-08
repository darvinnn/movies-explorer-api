const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards.reverse()))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки не существует');
      else if (card.owner.toString() !== req.user._id) throw new ForbiddenError('У вас нет прав для удаления карточки');
      else {
        Card.deleteOne(card)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Что-то не так с id карточки'));
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Что-то не так с id карточки'));
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Что-то не так с id карточки'));
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
