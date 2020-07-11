const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const xss = require("xss");

function makeUsersArray() {
    return [
      {
        id: 1,
        username: 'test-user-1',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        username: 'test-user-2',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        username: 'test-user-3',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 4,
        username: 'test-user-4',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
    ]
  }
  
  function makePostsArray(users) {
    return [
      {
        id: 1,
        name: 'First test post!',
        address: '111 test lane',
        user_id: users[0].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        url: 'https://google.com',
        price_rating: '4',
        size_rating: '3',
        location_rating: '2',
        usernotes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 2,
        name: 'Second test post!',
        address: '222 test lane',
        user_id: users[1].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        url: 'https://google.com',
        price_rating: '2',
        size_rating: '2',
        location_rating: '2',
        usernotes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 3,
        name: 'Thired test post!',
        address: '1333 test lane',
        user_id: users[2].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        url: 'https://google.com',
        price_rating: '5',
        size_rating: '5',
        location_rating: '2',
        usernotes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 4,
        name: 'Fourth test post!',
        address: '444 test lane',
        user_id: users[3].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        url: 'https://google.com',
        price_rating: '1',
        size_rating: '1',
        location_rating: '2',
        usernotes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
    ]
  }

  
  function makeExpectedPost(users, post, comments=[]) {
    const user = users
      .find(user => user.id === post.user_id)
  
      return {
        serializePost(post) {
            return {
                id: post.id,
                url: post.url,
                name: xss(post.name),
                address: xss(post.address),
                usernotes: xss(post.usernotes),
                price_rating: Number(post.price_rating),
                size_rating: Number(post.size_rating),
                location_rating: Number(post.location_rating),
            }
        }
    }
}
  
  
  
  function makePostsFixtures() {
    const testUsers = makeUsersArray()
    const testPosts = makePostsArray(testUsers)
    return { testUsers, testPosts}
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          homely_posts,
          homely_users
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE homely_posts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE homely_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('homely_posts_id_seq', 0)`),
          trx.raw(`SELECT setval('homely_users_id_seq', 0)`)
        ])
      )
    )
  }
  
  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('homely_users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('homely_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }
  
  function seedPostsTables(db, users, posts =[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('homely_posts').insert(posts)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('homely_posts_id_seq', ?)`,
        [posts[posts.length - 1].id],
      )
    })
  }
  
  function seedMaliciousPost(db, user, post) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('homely_posts')
          .insert([post])
      )
  }
  
  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: `${user.username}`,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
  
  module.exports = {
    makeUsersArray,
    makePostsArray,
    makeExpectedPost,
  
    makePostsFixtures,
    cleanTables,
    seedPostsTables,
    seedMaliciousPost,
    makeAuthHeader,
    seedUsers,
  }