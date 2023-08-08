const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: () => 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
