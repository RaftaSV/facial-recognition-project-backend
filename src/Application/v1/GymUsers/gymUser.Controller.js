import Joi from 'joi';
import UsuariosGymModel from './gymUser.Model';

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

export const insertGymUser = async (req, res) => {
  try {
    const { body, file } = req;
    // Definir el esquema de validación utilizando Joi
    const schema = Joi.object({
      nombre: Joi.string().required(),
      apellido: Joi.string().required(),
      foto: Joi.string().required(),
      genero: Joi.string().required(),
      fechaNacimiento: Joi.date().required(),
      numeroTelefono: Joi.string().required()
    });

    // Validar los datos de entrada
    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        message: 'Error al crear el usuario, todos los campos son requeridos',
        error: error.details[0].message
      });
    }



    // Guardar los datos en la base de datos
    const user = await UsuariosGymModel.create({
      nombre: body.nombre,
      apellido: body.apellido,
      imagenPerfil: Buffer.from(body.foto, 'base64');,
      genero: body.genero,
      fechaNacimiento: body.fechaNacimiento,
      numeroTelefono: body.numeroTelefono,
      estadoUsuario: 0
    });

    return res.status(200).json({
      message: 'Usuario creado correctamente',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el usuario',
      error: error.message
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
