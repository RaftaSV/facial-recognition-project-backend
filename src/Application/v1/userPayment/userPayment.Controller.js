import Joi from 'joi';
import { Op } from 'sequelize';
import UserPaymentModel from './userPayment.Model';
import MembershipModel from '../Memberships/Membership.Model';
import UserModel from '../GymUsers/gymUser.Model';

UserPaymentModel.belongsTo(MembershipModel, { foreignKey: 'idMembresia' });
UserPaymentModel.belongsTo(UserModel, { foreignKey: 'idUsuario' });
UserModel.hasMany(UserPaymentModel, { foreignKey: 'idUsuario' });
MembershipModel.hasMany(UserPaymentModel, { foreignKey: 'idMembresia' });

export const getUserPayments = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const user = await UserModel.findByPk(idUsuario);

    if (!user) {
      return res.status(404).json({
        message: 'El usuario no existe'
      });
    }

    const ultimoPago = await UserPaymentModel.findOne({
      where: {
        idUsuario,
        estadoPago: 0,
        fechaFinPago: {
          [Op.gte]: new Date()
        }
      },
      order: [['fechaFinPago', 'DESC']]
    });

    if (ultimoPago) {
      return res.status(200).json({
        message: 'El usuario está solvente con los pagos de la membresía',
        solvente: true
      });
    }
    return res.status(200).json({
      message: 'El usuario no está solvente con los pagos de la membresía',
      solvente: false
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al verificar la solvencia del usuario',
      error: error.message
    });
  }
};

export const insertUserPayment = async (req, res) => {
  try {
    const { body } = req;

    const schema = Joi.object({
      idUsuario: Joi.number().required(),
      idMembresia: Joi.number().required()
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).json({
        message: 'Error al crear el pago de usuario, todos los campos son requeridos',
        error: error.details[0].message
      });
    }

    const membership = await MembershipModel.findByPk(body.idMembresia);
    const user = await UserModel.findByPk(body.idUsuario);

    if (!membership || !user) {
      return res.status(404).json({
        message: 'La membresia o el usuario no existe'
      });
    }

    const fechaPago = new Date();
    const fechaFinPago = new Date();

    fechaPago.setDate(new Date().getDate());
    fechaFinPago.setDate(new Date().getDate() + membership.duracionMembresia);

    const userPayment = await UserPaymentModel.create({
      fechaPago,
      fechaFinPago,
      estadoPago: 0,
      idUsuario: parseInt(body.idUsuario, 10),
      idMembresia: parseInt(body.idMembresia, 10)
    });

    return res.status(201).json({
      message: `Pago de usuario ${user.nombre} insertado correctamente con la membresia ${membership.descripcion}`,
      userPayment
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el pago de usuario',
      error: error.message
    });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { idPago } = req.params;
    const { body } = req;

    const userPayment = await UserPaymentModel.findByPk(idPago);

    if (!userPayment) {
      return res.status(404).json({
        message: 'El pago no existe'
      });
    }

    const user = await UserModel.findByPk(body.idUsuario);

    if (!user) {
      return res.status(404).json({
        message: 'El usuario no existe'
      });
    }

    const membership = await MembershipModel.findByPk(body.idMembresia);

    if (!membership) {
      return res.status(404).json({
        message: 'La membresia no existe'
      });
    }

    const fechaPago = new Date();
    const fechaFinPago = new Date();

    if (body.fechaPago) {
      fechaPago.setDate(parseInt(body.fechaPago, 10));
      fechaFinPago.setDate(parseInt(body.fechaPago, 10) + membership.duracionMembresia);
    } else {
      fechaPago.setDate(new Date().getDate());
      fechaFinPago.setDate(new Date().getDate() + membership.duracionMembresia);
    }

    userPayment.fechaPago = fechaPago;
    userPayment.fechaFinPago = fechaFinPago;
    userPayment.idUsuario = parseInt(body.idUsuario, 10) || userPayment.idUsuario;
    userPayment.idMembresia = parseInt(body.idMembresia, 10) || userPayment.idMembresia;

    await userPayment.save();

    return res.status(200).json({
      message: `Pago de usuario ${user.nombre} actualizado correctamente con la membresia ${membership.descripcion}`,
      userPayment
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el pago de usuario',
      error: error.message
    });
  }
};

export const deleteUserPayment = async (req, res) => {
  try {
    const { idPago } = req.params;

    const userPayment = await UserPaymentModel.findByPk(idPago);

    if (!userPayment) {
      return res.status(404).json({
        message: 'El pago no existe'
      });
    }

    const user = await UserModel.findByPk(userPayment.idUsuario);

    userPayment.estadoPago = 1;
    await userPayment.save();

    return res.status(200).json({
      message: `Pago del usuario ${user.nombre} eliminado correctamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el pago de usuario',
      error: error.message
    });
  }
};
