const { celebrate } = require('celebrate');
const router = require('express').Router();
const {
  getUserByIdJoiValidation,
  updateAvatarJoiValidation, updateUserJoiValidation,
} = require('../middlewares/JoiValidators');
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', celebrate(getUserByIdJoiValidation), getUserById);
router.patch('/me', celebrate(updateUserJoiValidation), updateUser);
router.patch('/me/avatar', celebrate(updateAvatarJoiValidation), updateUserAvatar);

module.exports = router;
