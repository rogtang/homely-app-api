const path = require('path')
const express = require('express')
const xss = require('xss')
const PostsService = require('./posts-service')

const postsRouter = express.Router()
const bodyParser = express.json()

const serializePost = post => ({
  id: post.id,
  url: post.url,
  name: xss(post.name),
  address: xss(post.address),
  usernotes: xss(post.usernotes),
  price_rating: Number(post.price_rating),
  size_rating: Number(post.size_rating),
  location_rating: Number(post.location_rating),
  user_id: post.user_id
})

postsRouter
    .route('/')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      PostsService.getPosts(knexInstance)
      .then(posts => {
        res.json(posts.map(serializePost))
      })
      .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, url, address, usernotes, price_rating, size_rating, location_rating, user_id} = req.body;

        if (!name) {
          return res.status(400).send({
            error: { message: "'Name' is required" }
          })
        }
        
        if (!address) {
          return res.status(400).send({
            error: { message: "'address' is required" }
          })
        }

        if (!price_rating) {
            return res.status(400).send({
              error: { message: "A price rating is required" }
            })
          }
        
        if (!size_rating) {
            return res.status(400).send({
              error: { message: "A size rating is required" }
            })
          }

        if (!location_rating) {
            return res.status(400).send({
              error: { message: "A location rating is required" }
            })
          }
      
      
      const knexInstance = req.app.get('db')
      const newPost = {name, address, price_rating, size_rating, location_rating}
      
      newPost.user_id = user_id;

      PostsService.insertPost(knexInstance, newPost)
      .then(post => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${post.id}`))
        .json(serializePost(post));      
      })
      .catch(next)
      })

      

module.exports = postsRouter