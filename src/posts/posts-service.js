const PostsService = {
    getPosts(knex) {
        return knex.select('*').from('homely_posts')
    },
    getById(knex, id){
        return knex.select('*').from('homely_posts').where('id', id).first()
    },
    getByUser(knex, user_id) {
        return knex.select('*').from('homely_posts')
        .where('homely_posts.user_id', user_id)
    },
    insertPost(knex, newPost) {
        console.log(newPost)
        return (
            knex
            .insert(newPost)
            .into('homely_posts')
            .returning('*')
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
        .then(res => PostsService.getByUser(knex))
    },
    updatePost(knex, id, newPostFields) {
        return knex.from('homely_posts').where({id}).update(newPostFields);
    }
}

module.exports = PostsService