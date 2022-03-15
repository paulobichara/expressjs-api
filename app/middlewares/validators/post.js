const { body } = require('express-validator');

module.exports = [
  body('title').not().isEmpty().withMessage('Title must not be empty')
    .escape(),
  body('content')
    .not()
    .isEmpty()
    .withMessage('Content must not be empty')
    .escape()
    .bail(),
  body('published')
    .default(false)
    .isBoolean()
    .withMessage('Published must contain a boolean value')
    .bail(),
];
