
-- Trigger function to soft delete user
create or replace function _soft_delete_user() returns trigger as
	$$
	begin
		update public.users
		set deleted = true
		where id = old.id;
		
		perform _cascade_s_delete_sheet(old.id);
		perform _users_cascade_s_delete_comment(old.id);

		return null; -- return null prevents 'hard' deletion
	end
	$$ language PLPGSQL;

create trigger trig_soft_delete_user
before delete on users
for each row execute function _soft_delete_user();

-- alter table users disable trigger trig_soft_delete_user;
-- alter table users enable trigger trig_soft_delete_user;

-- Helper function to cascade soft delete on soft delete of user to sheet
create or replace function _cascade_s_delete_sheet(user_id integer) returns void as 
	$$
	begin
		update public.sheets 
		set deleted = true
		where created_by = user_id;
	end
	$$ language PLPGSQL;

	
-- Helper function to cascade soft delete on soft delete of user to comment
create or replace function _users_cascade_s_delete_comment(user_id integer) returns void as 
	$$
	begin
		update public.comments 
		set deleted = true
		where created_by = user_id;
	end
	$$ language PLPGSQL;

-- Trigger function to soft delete sheet
create or replace function _soft_delete_sheet() returns trigger as
	$$
	begin
		update public.sheets
		set deleted = true
		where id = old.id and not deleted;

        perform _cascade_s_delete_comment(old.id);

		return null; -- return null prevents 'hard' deletion
	end
	$$ language PLPGSQL;
	
create trigger trig_soft_delete_sheet
before delete on sheets
for each row execute function _soft_delete_sheet();

-- Helper function to cascade soft delete on soft delete of user to comment
create or replace function _sheets_cascade_s_delete_comment(sheet_id integer) returns void as
	$$
	begin
		update public.comments
        set deleted = TRUE
        where sheet = sheet_id;
	end
	$$ language PLPGSQL;

-- alter table sheets disable trigger trig_soft_delete_sheet;
-- alter table sheets enable trigger trig_soft_delete_sheet;

-- Trigger function to soft delete comment
create or replace function _soft_delete_comment() returns trigger as
	$$
	begin
		update public.comments
		set deleted = true
		where id = old.id and not deleted;

		return null; -- return null prevents 'hard' deletion
	end
	$$ language PLPGSQL;
	
create trigger trig_soft_delete_comment
before delete on comments
for each row execute function _soft_delete_comment();

-- alter table comments disable trigger trig_soft_delete_comment;
-- alter table comments enable trigger trig_soft_delete_comment;

-- TODO: Add comment cascade on user delete