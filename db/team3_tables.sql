create table users (
	id serial primary key,
	username varchar(50) not null unique,
	email varchar(50) not null,
	password varchar(200) not null,
	bio varchar(400) default '',
	is_admin boolean default false,
	is_locked boolean default false,
	num_failed_attempts int default 0,
	created_at timestamp default CURRENT_TIMESTAMP,
	last_logged_in timestamp default CURRENT_TIMESTAMP,
	deleted boolean not null default false
);

create table login_attempts (
	id serial primary key,
	user_id int references users(id) on delete cascade,
	ip_address varchar(40),
	attempted_on timestamp default CURRENT_TIMESTAMP
);

create table models (
	id serial primary key,
	name varchar(20) not null,
	tfjs varchar(10) default null, -- NOTE: type TBD
	description varchar(400) default '',
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
	created_by int references users(id) on delete set null,
	model int references models(id) on delete set null,
	title varchar(200) not null default 'Untitled',
	artist varchar(40) not null default 'Various Artists',
	description varchar(400) default '',
	num_downloads int not null default 0,
	instrument varchar(20) not null,
	musicxml varchar, -- NOTE: size TBD
	comments_enabled boolean default true,
	visibility visibility not null default 'public',
	created_at timestamp default CURRENT_TIMESTAMP,
	updated_at timestamp default CURRENT_TIMESTAMP,
	deleted boolean not null default false
);

create table sheet_downloads (
	id serial primary key,
    sheet_id int not null references sheets(id) on delete cascade,
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
	sheet int not null references sheets(id) on delete cascade,
	created_by int references users(id) on delete set null,
	created_at timestamp default CURRENT_TIMESTAMP,
	num_likes int not null default 0,
	updated_at timestamp default CURRENT_TIMESTAMP,
	content varchar(300) not null,
	deleted boolean not null default false
);

create table comment_likes (
    user_id int not null references users(id) on delete cascade,
    comment_id int not null references comments(id) on delete cascade,
	liked_on timestamp default CURRENT_TIMESTAMP,
    primary key (user_id, comment_id)
);