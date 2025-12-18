-- sqlite users.db < init_db_table.sql

create table if not exists users (
    id integer primary key autoincrement, 
    username text, password text
    );

