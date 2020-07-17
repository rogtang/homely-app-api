test users:

('demo@demo.com', 'password123'),
    ('roger@roger.com', 'roger'),
    ('joe@mocha.com', 'joemocha');
    
    "username": "michael@jordan.com",
    "password": "air23"

    {
    "username": "Dwight Schrute",
    "password": "beets"
}


to get a json webtoken, log-in using postman http://localhost:8000/api/auth/login and response body will contain token

select * from homely_posts p
join
homely_users u
on p.user_id = u.id
where u.id = 7;


production users:
demo@demo.com
password123

roger@roger.com
roger123