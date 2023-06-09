import express from 'express';
import {
  getGymUsers,
  insertGymUserWithPayment,
  updateGymUser,
  deleteGymUser

} from './gymUser.Controller';


const router = express.Router();

router.get('/', getGymUsers);
router.post('/', insertGymUserWithPayment);
router.put('/:idUsuario', updateGymUser);
router.delete('/:idUsuario', deleteGymUser);

export default router;
