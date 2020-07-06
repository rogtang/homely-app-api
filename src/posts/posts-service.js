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
            .where('user_id', newPost.user_id)
            .then((array) => {
                return array[0];
            })
        );
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