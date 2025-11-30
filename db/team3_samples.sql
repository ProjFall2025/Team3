-- users
insert into users (username, email, password, bio)
values
('mbrukson', 'michael@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Music enthusiast and AI researcher.'),
('mtesis', 'mtesis@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Music enthusiast and AI researcher .'),
('anosoff', 'anosoff@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Music enthusiast and AI researcher.'),
('jbrahms', 'brahms_the_best@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Professional pianist.'),
('ludb', 'beethoven@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Best pianist ever.'),
('siabassen', 'samir@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Music teacher with a passion for harmony.'),
('cleague', 'league@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Coding and beats.'),
('ychaya', 'yair@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Blending technology with rhythm.'),
('gmichael', 'georgie@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'The music seems so loud. Gotta have faith.'),
('PTchaikovsky', 'genius@example.com', '$2b$10$M70z6x9LPaK3RByWetgsD.hOiuMidCTHJ2S.X4GLDVD9Kkzh2tZoS', 'Я люблю чай.');

-- models
insert into models (name, path, description)
values
('Meyda', 'models/--', 'Algorithm alternative');

-- sheets
insert into sheets (created_by, model, title, artist, description, instrument, genre, comments_enabled, visibility)
values
((select id from users where username = 'mbrukson'), (select id from models where name = 'Meyda'), 'Careless Whispers', 'George Michael', 'The best song of all time.', 'Saxophone', 'Soul', false, 'public'),
((select id from users where username = 'mbrukson'), (select id from models where name = 'Meyda'), 'Carribean Queen', 'Billy Ocean', 'Carribean Queen by Billy Ocean.', 'Guitar', 'Classic Soul', true, 'follower'),
((select id from users where username = 'mtesis'), (select id from models where name = 'Meyda'), 'Gimme Gimme GImme', 'Abba', 'Give me more.', 'Piano', 'Electronic', true, 'private'),
((select id from users where username = 'anosoff'), (select id from models where name = 'Meyda'), 'War Pigs', 'Black Sabbath', 'A beautiful etude by black sabbath.', 'Piano', 'Soul', false, 'private'),
((select id from users where username = 'anosoff'), (select id from models where name = 'Meyda'), 'I Was Made For Lovin You', 'Kiss', 'A moving violin solo.', 'Violin', 'Classical', true, 'public'),
((select id from users where username = 'siabassen'), (select id from models where name = 'Meyda'), 'Around The World', 'Daft Punk', 'My favorite piece, ever.', 'Keyboard', 'Rock', false, 'public'),
((select id from users where username = 'cleague'), (select id from models where name = 'Meyda'), 'Technologic', 'Daft Punk', 'Harder Better Faster Stronger', 'Synth', 'EDM', false, 'public'),
((select id from users where username = 'ychaya'), (select id from models where name = 'Meyda'), 'Father Figure', 'George Michael', 'Father figure my george michael, made by model 1!', 'Bass', 'Blues', true, 'public'),
((select id from users where username = 'gmichael'), (select id from models where name = 'Meyda'), 'Mamma Mia', 'Abba', 'A vocal ensemble arrangement.', 'Voice', 'Choral', true, 'public'),
((select id from users where username = 'PTchaikovsky'), (select id from models where name = 'Meyda'), 'Waterloo', 'Abba', 'Experimental piece with algorithmic rhythms.', 'Piano', 'Experimental', false, 'public');

-- user_follows
insert into user_follows (follower, followee)
values
((select id from users where username = 'mtesis'), (select id from users where username = 'mbrukson')),
((select id from users where username = 'anosoff'), (select id from users where username = 'mbrukson')),
((select id from users where username = 'jbrahms'), (select id from users where username = 'mbrukson')),
((select id from users where username = 'mbrukson'), (select id from users where username = 'jbrahms')),
((select id from users where username = 'mbrukson'), (select id from users where username = 'mtesis')),
((select id from users where username = 'ludb'), (select id from users where username = 'siabassen')),
((select id from users where username = 'siabassen'), (select id from users where username = 'cleague')),
((select id from users where username = 'cleague'), (select id from users where username = 'ludb')),
((select id from users where username = 'ychaya'), (select id from users where username = 'gmichael')),
((select id from users where username = 'gmichael'), (select id from users where username = 'ychaya'));

-- sheet_downloads
insert into sheet_downloads (sheet_id, user_id)
values
((select id from sheets where title = 'Careless Whispers'), (select id from users where username = 'mtesis')),
((select id from sheets where title = 'Careless Whispers'), (select id from users where username = 'jbrahms')),
((select id from sheets where title = 'Careless Whispers'), (select id from users where username = 'ludb')),
((select id from sheets where title = 'War Pigs'), (select id from users where username = 'ludb')),
((select id from sheets where title = 'War Pigs'), (select id from users where username = 'anosoff')),
((select id from sheets where title = 'Around The World'), (select id from users where username = 'mtesis')),
((select id from sheets where title = 'Technologic'), (select id from users where username = 'ychaya')),
((select id from sheets where title = 'Father Figure'), (select id from users where username = 'siabassen')),
((select id from sheets where title = 'Mamma Mia'), (select id from users where username = 'PTchaikovsky')),
((select id from sheets where title = 'Waterloo'), (select id from users where username = 'gmichael'));

-- sheet_ratings
insert into sheet_ratings (user_id, sheet_id, rating)
values
((select id from users where username = 'mbrukson'), (select id from sheets where title = 'Careless Whispers'), 4.5),
((select id from users where username = 'mtesis'), (select id from sheets where title = 'Careless Whispers'), 5.0),
((select id from users where username = 'mbrukson'), (select id from sheets where title = 'War Pigs'), 4.0),
((select id from users where username = 'jbrahms'), (select id from sheets where title = 'I Was Made For Lovin You'), 4.8),
((select id from users where username = 'ludb'), (select id from sheets where title = 'Gimme Gimme GImme'), 3.9),
((select id from users where username = 'siabassen'), (select id from sheets where title = 'Technologic'), 4.2),
((select id from users where username = 'cleague'), (select id from sheets where title = 'Around The World'), 3.8),
((select id from users where username = 'ychaya'), (select id from sheets where title = 'Mamma Mia'), 5.0),
((select id from users where username = 'gmichael'), (select id from sheets where title = 'Waterloo'), 4.6),
((select id from users where username = 'PTchaikovsky'), (select id from sheets where title = 'Father Figure'), 4.1);

-- comments (insert sequentially so replies can reference earlier comments)
insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Careless Whispers'),
 (select id from users where username = 'mtesis'),
 NULL,
 'Absolutely beautiful!');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Careless Whispers'),
 (select id from users where username = 'mtesis'),
 (select id from comments where sheet = (select id from sheets where title = 'Careless Whispers')
                         and created_by = (select id from users where username = 'mtesis')
                         and content = 'Absolutely beautiful!'),
 'Loved the melody and dynamics.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Gimme Gimme GImme'),
 (select id from users where username = 'jbrahms'),
 NULL,
 'The synth layering is amazing.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Gimme Gimme GImme'),
 (select id from users where username = 'ludb'),
 (select id from comments where sheet = (select id from sheets where title = 'Gimme Gimme GImme')
                         and created_by = (select id from users where username = 'jbrahms')
                         and content = 'The synth layering is amazing.'),
 'Classic yet modern, I enjoyed it.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'I Was Made For Lovin You'),
 (select id from users where username = 'siabassen'),
 NULL,
 'Very emotional violin solo.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Around The World'),
 (select id from users where username = 'cleague'),
 NULL,
 'Smooth jazz transitions.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Around The World'),
 (select id from users where username = 'ychaya'),
 NULL,
 'Perfect blend of beats and melody!');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Father Figure'),
 (select id from users where username = 'gmichael'),
 NULL,
 'Really soulful saxophone.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Mamma Mia'),
 (select id from users where username = 'PTchaikovsky'),
 NULL,
 'Incredible vocal harmonies.');

insert into comments (sheet, created_by, replying_to, content)
values
((select id from sheets where title = 'Mamma Mia'),
 (select id from users where username = 'anosoff'),
 (select id from comments where sheet = (select id from sheets where title = 'Mamma Mia')
                         and created_by = (select id from users where username = 'PTchaikovsky')
                         and content = 'Incredible vocal harmonies.'),
 'Super creative and technical.');

-- comment_likes
insert into comment_likes (user_id, comment_id)
values
((select id from users where username = 'mbrukson'),
 (select id from comments where sheet = (select id from sheets where title = 'Careless Whispers')
                        and created_by = (select id from users where username = 'mtesis')
                        and content = 'Loved the melody and dynamics.')),
((select id from users where username = 'mtesis'),
 (select id from comments where sheet = (select id from sheets where title = 'Careless Whispers')
                        and created_by = (select id from users where username = 'mtesis')
                        and content = 'Absolutely beautiful!')),
((select id from users where username = 'anosoff'),
 (select id from comments where sheet = (select id from sheets where title = 'Gimme Gimme GImme')
                        and created_by = (select id from users where username = 'ludb')
                        and content = 'Classic yet modern, I enjoyed it.')),
((select id from users where username = 'jbrahms'),
 (select id from comments where sheet = (select id from sheets where title = 'Gimme Gimme GImme')
                        and created_by = (select id from users where username = 'jbrahms')
                        and content = 'The synth layering is amazing.')),
((select id from users where username = 'ludb'),
 (select id from comments where sheet = (select id from sheets where title = 'Around The World')
                        and created_by = (select id from users where username = 'cleague')
                        and content = 'Smooth jazz transitions.')),
((select id from users where username = 'siabassen'),
 (select id from comments where sheet = (select id from sheets where title = 'I Was Made For Lovin You')
                        and created_by = (select id from users where username = 'siabassen')
                        and content = 'Very emotional violin solo.')),
((select id from users where username = 'cleague'),
 (select id from comments where sheet = (select id from sheets where title = 'Around The World')
                        and created_by = (select id from users where username = 'ychaya')
                        and content = 'Perfect blend of beats and melody!')),
((select id from users where username = 'ychaya'),
 (select id from comments where sheet = (select id from sheets where title = 'Father Figure')
                        and created_by = (select id from users where username = 'gmichael')
                        and content = 'Really soulful saxophone.')),
((select id from users where username = 'gmichael'),
 (select id from comments where sheet = (select id from sheets where title = 'Mamma Mia')
                        and created_by = (select id from users where username = 'PTchaikovsky')
                        and content = 'Incredible vocal harmonies.')),
((select id from users where username = 'PTchaikovsky'),
 (select id from comments where sheet = (select id from sheets where title = 'Mamma Mia')
                        and created_by = (select id from users where username = 'anosoff')
                        and content = 'Super creative and technical.'));
