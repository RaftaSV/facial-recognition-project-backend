import Joi from 'joi';
import fs from 'fs';
import UsuariosGymModel from './gymUser.Model';
import UserPaymentModel from '../userPayment/userPayment.Model';
import MembershipModel from '../Memberships/Membership.Model';
import { databaseConnection } from 'Server/db';

export const getGymUsers = async (req, res) => {
  try {
    const usuariosGym = await UsuariosGymModel.findAll({
      where: {
        estadoUsuario: 0
      }
    });

    return res.status(200).json(usuariosGym);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los usuarios',
      error
    });
  }
};

export const insertGymUserWithPayment = async (req, res) => {
  const { body } = req;

  try {
    const schema = Joi.object({
      nombre: Joi.string().required(),
      apellido: Joi.string().required(),
      foto: Joi.string().required(),
      genero: Joi.string().required(),
      fechaNacimiento: Joi.date().required(),
      numeroTelefono: Joi.string().required(),
      membresia: Joi.number().required(),
    });

    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        message: 'Error al crear el usuario, todos los campos son requeridos',
        error: error.details[0].message,
      });
    }

    const membership = await MembershipModel.findByPk(body.membresia);
    if (!membership) {
      return res.status(404).json({
        message: 'La membresia no existe',
      });
    }

    // Guardar la imagen en un archivo temporal
    const imageData = Buffer.from(body.foto, 'base64');
    const imagePath = `public/uploads/image_${Date.now()}.jpg`;
    fs.writeFileSync(imagePath, imageData);

    const user = await databaseConnection.transaction(async (transaction) => {
      const createdUser = await UsuariosGymModel.create(
        {
          nombre: body.nombre,
          apellido: body.apellido,
          imagenPerfil: fs.readFileSync(imagePath),
          genero: body.genero,
          fechaNacimiento: body.fechaNacimiento,
          numeroTelefono: body.numeroTelefono,
          estadoUsuario: 0,
        },
        { transaction }
      );

      const fechaPago = new Date();
      const fechaFinPago = new Date();

      fechaPago.setDate(new Date().getDate());
      fechaFinPago.setDate(new Date().getDate() + membership.duracionMembresia);

      const userPayment = await UserPaymentModel.create(
        {
          fechaPago,
          fechaFinPago,
          estadoPago: 0,
          idUsuario: createdUser.idUsuario,
          idMembresia: parseInt(body.membresia, 10),
        },
        { transaction }
      );

      // Eliminar el archivo temporal después de guardarlo en la base de datos
     fs.unlinkSync(imagePath);

      return createdUser;
    });

    return res.status(201).json({
      message: `Pago de usuario ${body.nombre} insertado correctamente con la membresia ${membership.descripcion}`,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error al crear el pago de usuario',
      error: error.message,
    });
  }
};


export const updateGymUser = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { body, file } = req;

    // Obtener el usuario existente
    const user = await UsuariosGymModel.findByPk(idUsuario);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar los datos del usuario
    user.nombre = body.nombre || user.nombre;
    user.apellido = body.apellido || user.apellido;
    user.genero = body.genero || user.genero;
    user.fechaNacimiento = body.fechaNacimiento || user.fechaNacimiento;
    user.numeroTelefono = body.numeroTelefono || user.numeroTelefono;

    // Si se proporciona una nueva imagen
    if (file) {
      // Obtener la imagen en formato buffer
      const imageBuffer = file.buffer;
      user.imagenPerfil = imageBuffer;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

export const deleteGymUser = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    // Obtener el usuario existente
    const user = await UsuariosGymModel.findByPk(idUsuario);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }
    user.estadoUsuario = 1;
    await user.save();
    return res.status(200).json({
      message: 'Usuario eliminado correctamente',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message
    });
  }
};
