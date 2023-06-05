import express from 'express';

import userRouter from './GymUsers/gymUser.route';
import Membership from './Memberships/Membership.route';
import UserPayment from './userPayment/userPayment.route';
const router = express.Router();

router.use('/Usuarios', userRouter);
router.use('/Membrecias', Membership);
router.use('/Pagos', UserPayment);
export default router;
