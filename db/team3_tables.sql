create table users (
	id serial primary key,
	username varchar(50) not null,
	email varchar(50) not null,
	password varchar(200) not null,
	is_admin boolean default false,
	created_at timestamp default CURRENT_TIMESTAMP,
	last_logged_in timestamp default CURRENT_TIMESTAMP
);

create table models (
	id serial primary key,
	name varchar(20) not null,
	tfjs null, -- NOTE: type TBD
	description varcar(400),
	created_at timestamp default CURRENT_TIMESTAMP
);

create table user_follows (
	follower int not null references users(id) on delete cascade,
	followee int not null references users(id) on delete cascade,
	primary key (follower, followee),
	check (follower <> followee)
);

create type visibility as enum ('public', 'private', 'follower');

create table sheets (
	id serial primary key,
	created_by int not null references users(id) on delete set null,
	model int not null refernces models(id) on delete set null,
	title varchar(200) not null,
	artist varchar(40) not null,
	description varchar(400),
	num_downloads int not null default 0,
	instrument varchar(20) not null,
	musicxml varchar, -- NOTE: size TBD
	comments_enabled boolean default true,
	visibility visibility not null default 'public',
	created_at timestamp default CURRENT_TIMESTAMP,
	updated_at timestamp default CURRENT_TIMESTAMP,
);

create table downloaded_by (
    sheet_id int primary key references sheets(id) on delete cascade,
    user_id int not null references users(id) on delete cascade,
	downloaded_on timestamp default CURRENT_TIMESTAMP
);

create table sheet_ratings (
    user_id int not null references users(id) on delete cascade,
    sheet_id int not null references sheets(id) on delete cascade,
    rating float not null default 0.0 check (rating between 0.0 and 5.0),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    primary key (user_id, sheet_id)
);

-- Comments table, M-1 with sheets
create table comments (
	id serial primary key,
	sheet int references sheets(id) on delete cascade,
	created_by int references users(id) on delete set null,
	created_at timestamp default CURRENT_TIMESTAMP,
	num_likes int not null default 0,
	updated_at timestamp default CURRENT_TIMESTAMP,
	content varchar(300) not null
);

create table comment_likes (
    user_id int not null references users(id) on delete cascade,
    comment_id int not null references comments(id) on delete cascade,
    primary key (user_id, comment_id)
);

-- Trigger function to update the number of downloads on a sheet. Name comes from i++ / ++i, incrementing by one.
create or replace function num_downloads_plpl()
	returns trigger
	language PLPGSQL
	as
	$$
	begin
		update sheets s
		set num_downloads = num_downloads + 1
		where s.id = new.sheet_id;

		return new;
	end;
	$$


-- Trigger function to update the number of likes on a comment. Name comes from i++ / ++i, incrementing by one.
create or replace function num_likes_plpl()
	returns trigger
	language PLPGSQL
	as
	$$
	begin
		update comments c
		set num_likes = num_likes + 1
		where c.id = new.comment_id;

		return new;
	end;
	$$


create trigger incr_num_downloads
	after insert on downloaded_by
	for each row execute function num_downloads_plpl();

create trigger incr_num_likes
	after insert on comment_likes
	for each row execute function num_likes_plpl();


-- View to see a sheet with its average rating
create materialized view sheets_with_rating as
select s.*, coalesce(avg(r.rating),0) as avg_rating -- caolesce() here assigns 0 to sheets with 0 ratings
from sheets s
left join sheet_ratings r on s.id = r.sheet_id
group by s.id;

CREATE UNIQUE INDEX idx_sheets_with_rating_id ON sheets_with_rating (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY my_materialized_view;