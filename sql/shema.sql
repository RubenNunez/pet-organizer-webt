/*
    Zusatztechnik Serverseitige Persistenz:
    dieses Script ertellt das nötige Shema für die Webapplikation.
    Mit der Datenbank wird die Serverseitige Persistenz sichergestellt.
    Es werden bereits Daten eingefügt, sodass diejenige Person die diese MEP
    korrigiert, nicht selber einen Account erstellen muss.

    - das Script wurde von hand erstellt, sodass ja
      keine Konflikte beim wieder einspielen auftreten
    - nur einfachste MySQL Syntax wurde verwendet :) !!!
 */

-- Falls datenbank bereits vorhanden -> zuerst löschen
drop database if exists pet_organizer;

-- Database schema "pet-organizer" wird erstellt, wenn nicht schon vorhanden
create database if not exists pet_organizer;

-- Erstellen users Tabelle
create table if not exists users(userId int not null AUTO_INCREMENT,
                  username varchar(100) unique not null,
                  email varchar(100) unique not null,
                  password varchar(100) not null,
                  tel varchar(100),
                  primary key(userId));

-- Erstellen pets Tabelle
create table if not exists pets(petId int not null AUTO_INCREMENT,
                 petname varchar(100) not null,
                 birthday date,
                 chipId int unique null,
                 petnote varchar(255),
                 userId int,
                 primary key(petId),
                 constraint fk_userId
                 foreign key (userId) references users(userId));

-- hier werden bereits zwei user erstellt: (username:password) admin:admin! und service:service!
insert into users(username, email, password, tel)
values ('admin', 'admin@pet-organizer.com', '$2y$10$VC.cX/R00BMQSaKqFhVwS.nWfMdIaD3in6m0tEp9cJIYFmJ1uraxS', '+41123456891'),
       ('service', 'service@pet-organizer.com', '$2y$10$xZRCRxwg4tOfX8ojHgJZIOnesOpm8aiz7Bzrcmh.yb04GN1pG0bUu', '+41123456891');

-- hier werden auch schon zwei Tiere dem Admin zugeordnet bzw. hinzugefügt
insert into pets(petname, birthday, chipId, petnote, userId)
values ('kiko', '2020-01-01', 123456, 'note kiko', 1),
       ('Lina', '2017-01-01', 234567, 'note Lina', 1);

