import { databaseConnection } from 'Server/db';
import sequelize from 'sequelize';

const UsuariosGymModel = databaseConnection.define('Usuarios', {
  idUsuario: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: sequelize.STRING,
  apellido: sequelize.STRING,
  imagenPerfil: sequelize.STRING,
  genero: sequelize.STRING,
  fechaNacimiento: sequelize.DATEONLY,
  numeroTelefono: sequelize.STRING,
  estadoUsuario: sequelize.INTEGER

});

UsuariosGymModel.sync();
export default UsuariosGymModel;
