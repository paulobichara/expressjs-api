var express = require("express");
const { PrismaClient } = require("@prisma/client");
const validateUser = require("../middlewares/validators/user");

var router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (_, res) => {
  return res.json(await prisma.user.findMany());
});

router.post("/", ...validateUser, async (req, res) => {
  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  });
  res.json(newUser);
});

router.get("/:userId/posts/", async (_, res) => {
  return res.json(await prisma.post.findMany());
});

router.post("/:userId/posts/", async (req, res) => {
  const newPost = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      authorId: Number.parseInt(req.params.userId, 10),
    },
  });
  res.json(newPost);
});

module.exports = router;
