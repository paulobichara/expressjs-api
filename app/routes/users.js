const express = require("express");
const db = require("../connectors/database");
const validatePost = require("../middlewares/validators/post");
const validateUser = require("../middlewares/validators/user");
const validateUserId = require("../middlewares/validators/user-id");
const validator = require("../middlewares/validators/validator");

const router = express.Router();
const BASE_URL = "/";

router.get(BASE_URL, async (_, res) => {
  return res.json(await db.user.findMany());
});

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

router.get(
  "/:userId/posts",
  ...validateUserId,
  ...validator,
  async (req, res) => {
    const posts = await db.post.findMany({
      where: { authorId: req.params.userId },
    });
    return res.json(posts);
  }
);

router.post(
  "/:userId/posts",
  ...validateUserId,
  ...validatePost,
  ...validator,
  async (req, res) => {
    const newPost = await db.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        authorId: req.params.userId,
      },
    });
    res.json(newPost);
  }
);

module.exports = router;
