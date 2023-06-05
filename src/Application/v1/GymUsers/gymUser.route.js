import express from 'express';
import multer from 'multer';
import {
  getGymUsers,
  insertGymUser,
  updateGymUser,
  deleteGymUser

} from './gymUser.Controller';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/', getGymUsers);
router.post('/', upload.single('imagenPerfil'), insertGymUser);
router.put('/:idUsuario', upload.single('imagenPerfil'), updateGymUser);
router.delete('/:idUsuario', deleteGymUser);

export default router;
