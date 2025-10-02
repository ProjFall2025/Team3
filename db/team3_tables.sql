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
	primary key (follower, followee),
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
	updated_at timestamp default CURRENT_TIMESTAMP,
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
	updated_at timestamp default CURRENT_TIMESTAMP,
	content varchar(300) not null
);

-- Join table to associate users with what comments they've liked
create table comment_likes (
    user_id int not null references users(id) on delete cascade,
    comment_id int not null references comments(id) on delete cascade,
    primary key (user_id, comment_id)
);

-- Trigger function that updates "updated_at" column to now() on incoming row
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

-- Loop to add trigger to all columns with a column named "updated_at"
DO $$
	DECLARE
		t text;
	BEGIN
		FOR t IN
			SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at'
		LOOP
			EXECUTE format('create trigger update_timestamp
						before update on %I
						for each row execute function update_updated_at()', t,t);
		END loop;
	END;
$$ language 'plpgsql';

-- View to see a sheet with its average rating
create view sheets_with_rating as
select s.*, coalesce(avg(r.rating),0) as avg_rating -- caolesce() here assigns 0 to sheets with 0 ratings
from sheets s
left join sheet_ratings r on s.id = r.sheet_id
group by s.id;
