drop database if exists smartGYM;

create database smartGYM;

use smartGYM;

create table Usuarios(
idUsuario int not null auto_increment primary key,
nombre varchar(50),
apellido varchar(50),
imagenPerfil blob(100000),
genero varchar(30),
fechaNacimiento date, 
numeroTelefono varchar (9),
estadoUsuario int
);

create table Membresias(
idMembresia int not null auto_increment primary key,
descripcion varchar(100),
duracionMembresia int,
precioMembresia float,
estadoMembresia int
);

create table PagoUsuarios(
idPago int not null auto_increment primary key,
idUsuario int not null,
idMembresia int not null,
fechaPago date,
fechaFinPago date,
estadoPago int
);

alter table PagoUsuarios
add foreign key (idUsuario)
references Usuarios (idUsuario);

alter table PagoUsuarios
add foreign key (idMembresia)
references Membresias (idMembresia);
