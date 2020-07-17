const path = require("path");
const express = require("express");
const xss = require("xss");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { isWebUri } = require('valid-url')

const postsRouter = express.Router();
const bodyParser = express.json();

const serializePost = (post) => ({
  id: post.id,
  url: post.url,
  name: xss(post.name),
  address: xss(post.address),
  usernotes: xss(post.usernotes),
  price_rating: Number(post.price_rating),
  size_rating: Number(post.size_rating),
  location_rating: Number(post.location_rating),
  user_id: post.user_id
});

postsRouter
  .route("/")
  //GET method now requires authentication as well
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");
    console.log(req.user)
    PostsService.getByUser(knexInstance, req.user.id)
      .then((posts) => {
        res.json(posts.map(serializePost));
      })
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const {
      name,
      url,
      address,
      usernotes,
      price_rating,
      size_rating,
      location_rating,
    } = req.body;

    if (!name) {
      return res.status(400).send({
        error: { message: "'Name' is required" },
      });
    }

    if (!address) {
      return res.status(400).send({
        error: { message: "'Address' is required" },
      });
    }

    if (!price_rating) {
      return res.status(400).send({
        error: { message: "A price rating is required" },
      });
    }

    if (!size_rating) {
      return res.status(400).send({
        error: { message: "A size rating is required" },
      });
    }

    if (!location_rating) {
      return res.status(400).send({
        error: { message: "A location rating is required" },
      });
    }

    if ((url && !isWebUri(url))) {
      return res.status(400).send({
        error: { message: "'url' must be a valid URL"}
      })
    }

    const knexInstance = req.app.get("db");
    const newPost = {
      name,
      url,
      address,
      usernotes,
      price_rating,
      size_rating,
      location_rating
    };

    newPost.user_id = req.user.id;

    PostsService.insertPost(knexInstance, newPost)
      .then((post) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(serializePost(post));
      })
      .catch(next);
  });

postsRouter
  .route("/:post_id")
  .all(requireAuth)
  .all((req, res, next) => {
    PostsService.getById(req.app.get("db"), req.params.post_id)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            error: { message: `That post doesn't exist` },
          });
        }
        res.post = post;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializePost(res.post));
  })
  .delete((req, res, next) => {
    PostsService.deletePost(req.app.get("db"), req.params.post_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const {
      name,
      url,
      address,
      usernotes,
      price_rating,
      size_rating,
      location_rating,
      user_id
    } = req.body;

    const postToUpdate = { name,
      url,
      address,
      usernotes,
      price_rating,
      size_rating,
      location_rating,
      user_id
    }

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either name,
          url,
          address,
          user notes,
          a price rating,
          a size rating,
          or a location rating`
        }
      })

    PostsService.updatePost(
      req.app.get('db'),
      req.params.post_id,
      postToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = postsRouter;
