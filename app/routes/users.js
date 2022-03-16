const express = require('express');
const db = require('../connectors/database');
const validateUser = require('../middlewares/validators/user');
const validator = require('../middlewares/validators/validator');

const router = express.Router();
const BASE_URL = '/';

router.get(BASE_URL, async (_, res) => res.json(await db.user.findMany()));

router.post(BASE_URL, ...validateUser, ...validator, async (req, res) => {
  const newUser = await db.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
      photo: req.body.photo,
    },
  });
  res.json(newUser);
});

module.exports = router;
