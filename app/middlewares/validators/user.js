const { body } = require("express-validator");
const db = require("../../connectors/database");

module.exports = [
  body("email")
    .isEmail()
    .withMessage("E-mail is not valid")
    .normalizeEmail()
    .custom(async (email) => {
      const existing = await db.user.findFirst({ where: { email } });
      if (existing) throw new Error("E-mail is already in use");
    }),
];
