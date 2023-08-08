const { celebrate } = require('celebrate');

const router = require('express').Router();
const { createCardJoiValidation, changeCardJoiValidation } = require('../middlewares/JoiValidators');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', celebrate(createCardJoiValidation), createCard);
router.delete('/:cardId', celebrate(changeCardJoiValidation), deleteCard);
router.put('/:cardId/likes', celebrate(changeCardJoiValidation), likeCard);
router.delete('/:cardId/likes', celebrate(changeCardJoiValidation), dislikeCard);

module.exports = router;
