-- users
insert into users (username, email, password, bio)
values
('mbrukson', 'michael@example.com', 'hashed_pw_1', 'Music enthusiast and AI researcher.'),
('mtesis', 'mtesis@example.com', 'hashed_pw_2', 'Music enthusiast and AI researcher .'),
('anossof', 'anossof@example.com', 'hashed_pw_3', 'Music enthusiast and AI researcher.'),
('jbrahms', 'brahms_the_best@example.com', 'hashed_pw_4', 'Professional pianist.'),
('ludb', 'beethoven@example.com', 'hashed_pw_5', 'Best pianist ever.'),
('siabassen', 'samir@example.com', 'hashed_pw_6', 'Music teacher with a passion for harmony.'),
('cleague', 'league@example.com', 'hashed_pw_7', 'Coding and beats.'),
('ychaya', 'yair@example.com', 'hashed_pw_8', 'Blending technology with rhythm.'),
('gmichael', 'georgie@example.com', 'hashed_pw_9', 'The music seems so loud. Gotta have faith.'),
('PTchaikovsky', 'genius@example.com', 'hashed_pw_10', 'Я люблю чай.');

-- models
insert into models (name, description)
values
('TempModel', 'Placeholder for models');

-- sheets
insert into sheets (created_by, model, title, artist, description, instrument, genre, comments_enabled, visibility)
values
(1, 1, 'Careless Whispers', 'George Michael', 'The best song of all time.', 'Saxophone', 'Soul', false, 'public'),
(1, 1, 'Carribean Queen', 'Billy Ocean', 'Carribean Queen by Billy Ocean.', 'Guitar', 'Classic Soul', true, 'follower'),
(2, 1, 'Gimme Gimme GImme', 'Abba', 'Give me more.', 'Piano', 'Electronic', true, 'private'),
(3, 1, 'War Pigs', 'Black Sabbath', 'A beautiful etude by black sabbath.', 'Piano', 'Soul', false, 'private'),
(3, 1, 'I Was Made For Lovin You', 'Kiss', 'A moving violin solo.', 'Violin', 'Classical', true, 'public'),
(6, 1, 'Around The World', 'Daft Punk', 'My favorite piece, ever.', 'Keyboard', 'Rock', false, 'public'),
(7, 1, 'Technologic', 'Daft Punk', 'Harder Better Faster Stronger', 'Synth', 'EDM', false, 'public'),
(8, 1, 'Father Figure', 'George Michael', 'Father figure my george michael, made by model 1!', 'Bass', 'Blues', true, 'public'),
(9, 1, 'Mamma Mia', 'Abba', 'A vocal ensemble arrangement.', 'Voice', 'Choral', true, 'public'),
(10, 1, 'Waterloo', 'Abba', 'Experimental piece with algorithmic rhythms.', 'Piano', 'Experimental', false, 'public');

-- user_follows
insert into user_follows (follower, followee)
values
(2, 1), (3, 1), (4, 1), (1, 4), (1, 2),
(5, 6), (6, 7), (7, 5), (8, 9), (9, 8);

-- sheet_downloads
insert into sheet_downloads (sheet_id, user_id)
values
(1, 2), (1, 4), (1, 5), (4, 5), (4, 3),
(6, 2), (7, 8), (8, 6), (9, 10), (10, 9);

-- sheet_ratings
insert into sheet_ratings (user_id, sheet_id, rating)
values
(1, 1, 4.5), (2, 1, 5.0), (1, 4, 4.0), (4, 5, 4.8), (5, 3, 3.9),
(6, 7, 4.2), (7, 6, 3.8), (8, 9, 5.0), (9, 10, 4.6), (10, 8, 4.1);

-- comments
insert into comments (sheet, created_by, replying_to, content)
values
(1, 2, null,'Absolutely beautiful!'),
(1, 2, 1, 'Loved the melody and dynamics.'),
(3, 4, null, 'The synth layering is amazing.'),
(3, 5, 3, 'Classic yet modern, I enjoyed it.'),
(5, 6, null, 'Very emotional violin solo.'),
(6, 7, null, 'Smooth jazz transitions.'),
(6, 8, null, 'Perfect blend of beats and melody!'),
(8, 9, null, 'Really soulful saxophone.'),
(9, 10, null, 'Incredible vocal harmonies.'),
(9, 3, 9, 'Super creative and technical.');

-- comment_likes
insert into comment_likes (user_id, comment_id)
values
(1, 2), (2, 1), (3, 4), (4, 3), (5, 6),
(6, 5), (7, 7), (8, 8), (9, 9), (10, 10);
