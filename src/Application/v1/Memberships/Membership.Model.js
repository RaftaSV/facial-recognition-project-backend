import { databaseConnection } from 'Server/db';
import sequelize from 'sequelize';

const MembershipModel = databaseConnection.define('Membresias', {
  idMembresia: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: sequelize.STRING,
  duracionMembresia: sequelize.INTEGER,
  precioMembresia: sequelize.FLOAT,
  estadoMembresia: sequelize.INTEGER
});

MembershipModel.sync();

export default MembershipModel;
