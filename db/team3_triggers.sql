
-- Trigger function to update the number of downloads on a sheet. Name comes from i++ / ++i, incrementing by one.
create or replace function num_downloads_plpl() returns trigger as
	$$
	begin
		update sheets s
		set num_downloads = num_downloads + 1
		where s.id = new.sheet_id;

		return new;
	end
	$$ language PLPGSQL;
	
create trigger incr_num_downloads
after insert on sheet_downloads
for each row execute function num_downloads_plpl();


-- Trigger function to update the number of likes on a comment. Name comes from i++ / ++i, incrementing by one.
create or replace function num_likes_plpl() returns trigger as
	$$
	begin
		update comments c
		set num_likes = num_likes + 1
		where c.id = new.comment_id;

		return new;
	end
	$$ language PLPGSQL;
	
create trigger incr_num_likes
after insert on comment_likes
for each row execute function num_likes_plpl();


-- Trigger function to update the number of likes on a comment. Name comes from i-- / --i, decrementing by one.
create or replace function num_likes_mimi() returns trigger as
	$$
	begin
		update comments c
		set num_likes = num_likes - 1
		where c.id = new.comment_id;

		return new;
	end
	$$ language PLPGSQL;
	
create trigger decr_num_likes
after delete on comment_likes
for each row execute function num_likes_mimi();


-- Trigger function to update the number of login attempts for a user.
-- NOTE: checking for u.num_failed_attempts +1 because query checks for the most recent -1 value of num_failed_attempts.
create or replace function check_num_attempts() returns trigger as
	$$
	begin
		update users u
		set 
			num_failed_attempts = case when new.succeeded then 0 else u.num_failed_attempts + 1 end,
			is_locked = case 
				when new.succeeded then false
				when (u.num_failed_attempts + 1) >= 5 then true else 
				false 
			end
		where u.id = new.user_id;

		return new;
	end
	$$ language PLPGSQL;
	
create trigger incr_failed_attempts
after insert on login_attempts
for each row execute function check_num_attempts();

-- View to see a sheet with its average rating
create materialized view sheets_with_rating as
select s.*, coalesce(avg(r.rating),0) as avg_rating -- coalesce() here assigns 0 to sheets with 0 ratings
from sheets s
left join sheet_ratings r on s.id = r.sheet_id
group by s.id;

CREATE UNIQUE INDEX idx_sheets_with_rating_id ON sheets_with_rating (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY sheets_with_rating;


-- View to see top 10 sheets by num_downloads
create materialized view ten_sheets_by_downloads as
select *
from sheets
order by num_downloads desc
limit 10;

CREATE UNIQUE INDEX idx_ten_sheets_by_downloads ON ten_sheets_by_downloads (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY ten_sheets_by_downloads;

-- View to see top 10 sheets by avg_rating
create materialized view ten_sheets_by_rating as
select *
from sheets_with_rating
order by avg_rating desc
limit 10;

CREATE UNIQUE INDEX idx_ten_sheets_by_downloads ON ten_sheets_by_downloads (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY ten_sheets_by_downloads;