create or replace rule "_soft_delete_user" as on delete to "users"
do instead(
    update users set deleted = true where id = old.id and not deleted
);
-- alter table users disable rule _soft_delete_user


create or replace rule "_soft_delete_sheet" as on delete to "sheets"
do instead(
    update sheets set deleted = true where id = old.id and not deleted
);
-- alter table users disable rule _delete_sheets


create or replace rule "_soft_delete_comment" as on delete to "comments"
do instead(
    update comments set deleted = true where id = old.id and not deleted
);
-- alter table sheets disable rule _soft_delete_sheet


create rule "_delete_sheets" as on update to users
  where old.deleted and new.deleted
  do also update sheets set deleted = true where created_by = old.id;
-- alter table comments disable rule _soft_delete_comment