create table users (
	id uuid primary key default gen_random_uuid(),
	google_id int default null,
	authenticated boolean default false not null,
	username varchar(50) unique not null unique,
	email varchar(50) unique not null,
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
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	succeeded boolean not null,
	ip_address varchar(40),
	attempted_on timestamp default CURRENT_TIMESTAMP
);

create table models (
	id uuid primary key default gen_random_uuid(),
	name varchar(20) not null,
	path varchar(50) default null, -- NOTE: type TBD
	description varchar(400) default '',
	created_at timestamp default CURRENT_TIMESTAMP
);

create table user_follows (
	follower uuid not null references users(id) on delete cascade,
	followee uuid not null references users(id) on delete cascade,
	primary key (follower, followee),
	check (follower <> followee)
);

create type visibility as enum ('public', 'private', 'follower');

create table sheets (
	id uuid primary key default gen_random_uuid(),
	created_by uuid references users(id) on delete set null,
	model uuid references models(id) on delete set null,
	title varchar(200) not null default 'Untitled',
	artist varchar(40) not null default 'Various Artists',
	description varchar(400) default '',
	num_downloads int not null default 0,
	instrument varchar(20) not null,
	genre varchar(20),
	musicxml varchar, -- NOTE: size TBD
	comments_enabled boolean default true,
	visibility visibility not null default 'public',
	created_at timestamp default CURRENT_TIMESTAMP,
	updated_at timestamp default CURRENT_TIMESTAMP,
	deleted boolean not null default false
);

create table sheet_downloads (
	id uuid primary key default gen_random_uuid(),
    sheet_id uuid not null references sheets(id) on delete cascade,
    user_id uuid references users(id) on delete set null,
	downloaded_on timestamp default CURRENT_TIMESTAMP
);

create table sheet_ratings (
    user_id uuid not null references users(id) on delete cascade,
    sheet_id uuid not null references sheets(id) on delete cascade,
		comment uuid default null references comments(id),
    rating float not null default 0.0 check (rating between 0.0 and 5.0),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    primary key (user_id, sheet_id)
);

-- Note: Potentially add check (not a literal CHECK, probably a trigger) to enforce that
-- the comment referenced in replying_to is under the same sheet. (Logically: check (sheet == replying_to.sheet))
create table comments (
	id uuid primary key default gen_random_uuid(),
	sheet uuid not null references sheets(id) on delete cascade,
	created_by uuid references users(id) on delete set null,
	replying_to uuid default null references comments(id),
	created_at timestamp default CURRENT_TIMESTAMP,
	num_likes int not null default 0,
	updated_at timestamp default CURRENT_TIMESTAMP,
	content varchar(300) not null,
	deleted boolean not null default false
);

create table comment_likes (
    user_id uuid not null references users(id) on delete cascade,
    comment_id uuid not null references comments(id) on delete cascade,
	liked_on timestamp default CURRENT_TIMESTAMP,
    primary key (user_id, comment_id)
);