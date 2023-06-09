import express from 'express';
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
router.post('/', insertGymUser);
router.put('/:idUsuario', updateGymUser);
router.delete('/:idUsuario', deleteGymUser);

export default router;
