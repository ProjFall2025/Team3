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
REFRESH MATERIALIZED VIEW CONCURRENTLY sheets_with_rating;