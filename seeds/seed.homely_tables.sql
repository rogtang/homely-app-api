BEGIN;

TRUNCATE
  homely_posts,
  homely_users
  RESTART IDENTITY CASCADE;

INSERT INTO homely_users (username, password)
VALUES
    ('demo@demo.com', '$2a$12$HZ/fjbzxttUj0irTLdDXhefefVlcn2Myir7mlEF0FzoXWzr36wbyO'),
    ('roger@roger.com', '$2a$12$PqeTLzbDeLuSrG4UV6RtIuSaBIAB8Ak25QGVEP06D.N7K7boE/dlK'),
    ('joe@mocha.com', '$2a$12$W8RbWDtZ9IE0xajpcWqFHubk5R/GABjqBoWly82x2Dh6i/HZ2d67m');

INSERT INTO homely_posts (name, address, userNotes, url, price_rating, size_rating, location_rating, user_id)
VALUES
    ('The White House', '1600 Pennslyvania Ave, Washington DC, 20500', 'Lovely exteriors, spatial front yard, but kitchens need renovation. Plenty of natural light. Spacious living areas but air conditioning will need to be replaced. Cabinets are outdated. Furniture will not be included.', 'https://zillow.com/homes', '1', '5', '4', 1),
    ('The Palace', '6 Championship Dr, Auburn Hills, MI 48326', 'Fits within budget, looks like it has not been lived in for years, great lighting', 'https://zillow.com/homes', '4', '2', '2', 3),
    ('The White Picket Fence', '111 American Dream Lane, South Pasadena, CA 91030', 'The epitome of the American Dream. My son loved the white picked fence and big backyard for the dog to run around in. One problem is that is too far from downtown and any commecial activity.', 'https://zillow.com/homes', '2', '5', '1', 2);

COMMIT;