const { body, validationResult } = require("express-validator");

module.exports = [
  body("email")
    .isEmail()
    .withMessage("E-mail is not valid!")
    .normalizeEmail()
    .custom(async (email) => {
      try {
        const existing = await prisma.user.findFirst({ where: { email } });
        if (existing) throw new Error("E-mail already in use");
      } catch (err) {
        console.error(err);
      }
    })
    .withMessage("E-mail is already in use!"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  },
];
