const { param } = require('express-validator');
const db = require('../../connectors/database');

module.exports = [
  param('userId')
    .exists()
    .withMessage('User ID must be provided')
    .bail()
    .isNumeric()
    .withMessage('User ID must be a number')
    .bail()
    .toInt()
    .custom(async (userId) => {
      const existing = await db.user.findUnique({ where: { id: userId } });
      if (!existing) throw new Error('User not found');
    })
    .bail(),
];
