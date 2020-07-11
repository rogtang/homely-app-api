const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers.js')
const xss = require('xss')

const serializePost = (post) => ({
    id: post.id,
    url: post.url,
    name: xss(post.name),
    address: xss(post.address),
    usernotes: xss(post.usernotes),
    price_rating: Number(post.price_rating),
    size_rating: Number(post.size_rating),
    location_rating: Number(post.location_rating),
  });

describe('Posts Endpoints', () => {
    let db

    const {
        testUsers,
        testPosts,
    } = helpers.makePostsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/posts', () => {
        context(`Given no posts`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )
            it(`responds with 200 and an empty list`, () => {
                const validUser = testUsers[0]
                return supertest(app)
                    .get(`/api/posts`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, [])
            })
        })

        context('Given there are posts in the database', () => {
            beforeEach('insert posts', () =>
                helpers.seedRecordsTables(
                    db,
                    testUsers,
                    testPosts
                )
            )
        })
    })
})