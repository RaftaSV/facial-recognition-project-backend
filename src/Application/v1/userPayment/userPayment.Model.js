import sequelize from 'sequelize';
import { databaseConnection } from'Server/db'

const UserPaymentModel = databaseConnection.define('PagoUsuarios', {
  idPago: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaPago: sequelize.DATEONLY,
  fechaFinPago: sequelize.DATEONLY,
  estadoPago: sequelize.INTEGER,
  idUsuario: {
    type: sequelize.INTEGER,
    references: {
      model: 'Usuarios',
      key: 'idUsuario'
    }
  },
  idMembresia: {
    type: sequelize.INTEGER,
    references: {
      model: 'Membresias',
      key: 'idMembresia'
    }
  },

});

UserPaymentModel.sync();
export default UserPaymentModel;
