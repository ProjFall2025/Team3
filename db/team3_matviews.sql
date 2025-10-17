-- View to see a sheet with its average rating
create materialized view sheets_with_rating as
select s.*, coalesce(avg(r.rating),0) as avg_rating -- coalesce() here assigns 0 to sheets with 0 ratings
from sheets s
left join sheet_ratings r on s.id = r.sheet_id
group by s.id;

create unique index idx_sheets_with_rating_id on sheets_with_rating (id);
refresh materialized view concurrently sheets_with_rating;


-- View to see top 10 sheets by num_downloads
create materialized view ten_sheets_by_downloads as
select *
from sheets
order by num_downloads desc
limit 10;

create unique index idx_ten_sheets_by_downloads on ten_sheets_by_downloads (id);
refresh materialized view concurrently ten_sheets_by_downloads;


-- View to see top 10 sheets by avg_rating
-- NOTE: This is a nested materialized view
create materialized view ten_sheets_by_rating as
select *
from sheets_with_rating
order by avg_rating desc
limit 10;

create unique index idx_ten_sheets_by_rating on ten_sheets_by_rating (id);
refresh materialized view concurrently ten_sheets_by_rating;