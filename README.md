# Homely

## Summary

Research indicates the average buyer will visit 10 houses
over 10 weeks before finding the right place. The search for the
perfect place to live can be a whirlwind of open houses and
scrolling through countless online listings in a short amount of
time. Homely helps you keep track of all the houses and apartments
you've visited. Quickly create a post for each place, assign it an
alias as a handy reference, and make notes on your initial
impressions and potential renovation ideas before you visit the
next place and forget. Find out the description in the listing
doesn't match reality? Jot it down.

## Live Site

- [Link](https://homely-app.vercel.app/) to view it in the browser.
- [Link](https://github.com/rogtang/homely-app-client) to view the client built with React.js.


## Endpoints
- /api/posts
    - GET (GETs all posts from the logged-in user)
    - POST (POSTs a new location post)
- /api/posts/:post_id
    - GET (GETs an individual post from the logged-in user)
    - DELETE (DELETEs an individual post from the logged-in user)
    - PATCH (Edits an individual post from the logged-in user)
- /api/users
    - GET (GETs all users stored in the Homely Users database)
    - POST (Adds a new user in the Homely Users database)
- /api/auth/login
    - POST (Authenticates an existing user in the Homely Users database)

## Built With (Server-side):

- Node.js
- Express.js
- Knex.js (SQL Query Builder)
- PostgreSQL
- Supertest (Testing)
- Mocha (Testing)
- Chai (Testing)

## Scripts

Install node modules `npm install`

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`
