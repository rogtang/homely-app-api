DROP TABLE IF EXISTS homely_posts;
CREATE TYPE star_rating AS ENUM ('1', '2', '3', '4', '5');

CREATE TABLE homely_posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    address text NOT NULL,
    userNotes TEXT,
    url text,
    price_rating star_rating NOT NULL,
    size_rating star_rating NOT NULL,
    location_rating star_rating NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER REFERENCES homely_users(id) ON DELETE CASCADE NOT NULL
);