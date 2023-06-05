import Joi from 'joi';
import MembershipModel from './Membership.Model';

export const getMemberships = async (req, res) => {
  try {
    const memberships = await MembershipModel.findAll({
      where: {
        estadoMembresia: 0
      }
    });
    return res.status(200).json(memberships);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las membresias',
      error: error.message
    });
  }
};

export const insertMembership = async (req, res) => {
  console.log(req.body);
  try {
    const { body } = req;
    const schema = Joi.object({
      descripcion: Joi.string().required(),
      duracionMembresia: Joi.number().required(),
      precioMembresia: Joi.number().required()
    });
    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        message: 'Error al crear la membresia, todos los campos son requeridos',
        error: error.details[0].message
      });
    }
    const membership = await MembershipModel.create({
      descripcion: body.descripcion,
      duracionMembresia: parseInt(body.duracionMembresia, 10),
      precioMembresia: parseFloat(body.precioMembresia).toFixed(2),
      estadoMembresia: 0
    });
    return res.status(201).json({
      message: 'Membresia creada correctamente',
      membership
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la membresia',
      error: error.message
    });
  }
};

export const updateMembership = async (req, res) => {
  try {
    const { idMembresia } = req.params;
    const { body } = req;
    const membership = await MembershipModel.findByPk(idMembresia);
    if (!membership) {
      return res.status(404).json({
        message: 'No se encontró la membresia'
      });
    }
    membership.descripcion = body.descripcion;
    membership.duracionMembresia = parseInt(body.duracionMembresia, 10)
    || membership.duracionMembresia;
    membership.precioMembresia = parseFloat(body.precioMembresia).toFixed(2)
    || membership.precioMembresia;

    await membership.save();

    return res.status(200).json({
      message: 'Membresia actualizada correctamente',
      membership
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la membresia',
      error: error.message
    });
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const { idMembresia } = req.params;
    const membership = await MembershipModel.findByPk(idMembresia);
    if (!membership) {
      return res.status(404).json({
        message: 'No se encontró la membresia'
      });
    }
    membership.estadoMembresia = 1;
    await membership.save();
    return res.status(200).json({
      message: 'Membresia eliminada correctamente',
      membership
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la membresia',
      error: error.message
    });
  }
};
