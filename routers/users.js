const { celebrate } = require('celebrate');
const router = require('express').Router();
const { updateUserJoiValidation } = require('../middlewares/JoiValidators');
const { updateUser, getUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate(updateUserJoiValidation), updateUser);

module.exports = router;
