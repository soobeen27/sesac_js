create table if not exists users (
    id integer primary key autoincrement,
    username text not null,
    password text not null
);

-- insert into users (username, password) values ('user1', 'password1');
-- insert into users (username, password) values ('user2', 'password2');