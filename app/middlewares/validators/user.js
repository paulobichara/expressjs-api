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
  body("name")
    .if((value) => !!value)
    .not()
    .isEmpty()
    .withMessage("Name must not be an empty string")
    .escape(),
  body("bio")
    .if((value) => !!value)
    .not()
    .isEmpty()
    .withMessage("Bio must not be an empty string")
    .escape(),
  body("photo")
    .if((value) => !!value)
    .isURL()
    .withMessage("Photo must be a URL"),
];
