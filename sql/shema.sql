/*
    Zusatztechnik Serverseitige Persistenz:
 */

drop database if exists pet_organizer;

-- Database schema "pet-organizer"
create database if not exists pet_organizer;

-- create the user table
create table if not exists users(userId int not null AUTO_INCREMENT,
                  username varchar(100) unique not null,
                  email varchar(100) unique not null,
                  password varchar(100) not null,
                  tel varchar(100),
                  primary key(userId));

-- create the pet table
create table if not exists pet(id int primary key,
                 name varchar(100) not null,
                 birthday date,
                 chipId int unique null,
                 userId int,
                 constraint fk_userId
                 foreign key (userId) references users(userId));

-- hier werden bereits zwei user erstellt: (username:password) admin:admin! und service:service!
insert into users(username, email, password, tel)
values ('admin', 'admin@pet-organizer.com', '$2y$10$VC.cX/R00BMQSaKqFhVwS.nWfMdIaD3in6m0tEp9cJIYFmJ1uraxS', '+41123456891'),
       ('service', 'service@pet-organizer.com', '$2y$10$xZRCRxwg4tOfX8ojHgJZIOnesOpm8aiz7Bzrcmh.yb04GN1pG0bUu', '+41123456891')

