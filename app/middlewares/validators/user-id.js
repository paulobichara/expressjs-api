const { param } = require('express-validator');
const db = require('../../connectors/database');

module.exports = [
  param('userId')
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
