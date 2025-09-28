create table users (
	id serial primary key,
	username varchar(50) not null,
	email varchar(50) not null,
	password varchar(200) not null,
	is_admin boolean default false,
	created_at timestamp default CURRENT_TIMESTAMP
);

create table user_follows (
	follower int not null references users(id) on delete cascade,
	followee int not null references users(id) on delete cascade,
	primary_key (follower, followee),
	check (follower <> followee)
);

create type visibility as enum ('public', 'private', 'follower');

create table sheets (
	id serial primary key,
	created_by int not null references users(id) on delete cascade,
	title varchar(200) not null,
	description varchar(400),
	musicxml varchar,
	visibility visibility not null default 'public',
	created_at timestamp default CURRENT_TIMESTAMP,
	updated_at timestamp default CURRENT_TIMESTAMP
);

create or replace function update_updated_at()
	returns trigger
	language PLPGSQL
	as
	$$
	begin
		new.updated_at = NOW();
		return new;
	end;
	$$

create trigger update_sheets_time
before update on sheets
for each row
execute function update_updated_at();

