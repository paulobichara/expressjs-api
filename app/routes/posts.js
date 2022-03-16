const express = require('express');
const db = require('../connectors/database');
const validatePost = require('../middlewares/validators/post');
const validateUserId = require('../middlewares/validators/user-id');
const validator = require('../middlewares/validators/validator');

const router = express.Router();
const BASE_URL = '/';

router.get(
  BASE_URL,
  ...validateUserId,
  ...validator,
  async (req, res) => {
    const posts = await db.post.findMany({
      where: { authorId: req.params.userId },
    });
    return res.json(posts);
  },
);

router.post(
  BASE_URL,
  ...validateUserId,
  ...validatePost,
  ...validator,
  async (req, res) => {
    const newPost = await db.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        authorId: req.query.userId,
      },
    });
    res.json(newPost);
  },
);

module.exports = router;
