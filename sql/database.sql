

drop database if exists pet_organizer;

-- Database schema "pet-organizer"
create database if not exists pet_organizer;

-- create the user table
create table if not exists `user`(userId int not null AUTO_INCREMENT,
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
                 foreign key (userId) references `user`(userId));

insert into `user`(username, email, password, tel)
values ('admin', 'admin@pet-organizer.com', 'admin!', '+41708103449'),
       ('service', 'service@pet-organizer.com', 'service!', '+41708103449')

