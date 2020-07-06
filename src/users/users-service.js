const xss = require('xss')
const bcrypt = require('bcryptjs')


const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('homely_users')
      },
    hasUserWithUserName(db, username) {
         return db('homely_users')
           .where({ username })
           .first()
           .then(user => !!user)
       },
    insertUser(db, newUser) {
       return db
       .insert(newUser)
       .into('homely_users')
       .returning('*')
       .then(([user]) => user)
   },
   getById(knex, id) {
    return knex
      .from('homely_users')
      .select('*')
      .where('id', id)
      .first()
  },
    validatePassword(password) {
      if (password.length < 5) {
        return 'Password must be at least 5 characters'
      }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
      }
      if (password.startsWith(' ') || password.endsWith(' ')) {
             return 'Password must not start or end with empty spaces'
           }
     return null
    },
    hashPassword(password) {
         return bcrypt.hash(password, 12)
       },
    serializeUser(user) {
           return {
             id: user.id,
             username: xss(user.username),
             date_created: new Date(user.date_created),
           }
         },
  }
  
  module.exports = UsersService