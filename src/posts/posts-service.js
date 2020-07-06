const xss = require('xss')

const PostsService = {
    getPosts(knex) {
        return knex.select('*').from('homely_posts')
    },
    getById(knex, id){
        return knex.select('*').from('homely_posts').where('id', id).first()
    },
    insertPost(knex, newPost) {
        return (
            knex
            .insert(newPost)
            .into('homely_posts')
            .returning('*')
            .then(([post]) => post)
      .then(post =>
        PostsService.getById(db, post.id)
      ))
    },
    insertUserPost(knex, newPost) {
        return knex
            .insert(newPost)
            .into('homely_posts')
            .where('user_id', newPost.user_id)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deletePost(knex, id) {
        return knex.from('homely_posts').where('id', id).delete()
    },
    updatePost(knex, id, newPostFields) {
        return knex.from('homely_posts').where({id}).update(newPostFields);
    }
}

module.exports = PostsService