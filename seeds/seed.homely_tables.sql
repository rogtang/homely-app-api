BEGIN;

TRUNCATE
  homely_posts,
  homely_users
  RESTART IDENTITY CASCADE;

INSERT INTO homely_users (username, password)
VALUES
    ('demo@demo.com', 'password123'),
    ('roger@roger.com', 'roger'),
    ('joe@mocha.com', 'joemocha');

INSERT INTO homely_posts (name, address, userNotes, url, price_rating, size_rating, location_rating, user_id)
VALUES
    ('The White House', '1600 Pennslyvania Ave, Washington DC, 20500', 'Lovely exteriors, spatial front yard, but kitchens need renovation. Plenty of natural light. Spacious living areas but air conditioning will need to be replaced. Cabinets are outdated. Furniture will not be included.', 'https://zillow.com/homes', '1', '5', '4', 1),
    ('The Palace', '6 Championship Dr, Auburn Hills, MI 48326', 'Fits within budget, looks like it has not been lived in for years, great lighting', 'https://zillow.com/homes', '4', '2', '2', 3),
    ('The White Picket Fence', '111 American Dream Lane, South Pasadena, CA 91030', 'The epitome of the American Dream. My son loved the white picked fence and big backyard for the dog to run around in. One problem is that is too far from downtown and any commecial activity.', 'https://zillow.com/homes', '2', '5', '1', 2);

COMMIT;