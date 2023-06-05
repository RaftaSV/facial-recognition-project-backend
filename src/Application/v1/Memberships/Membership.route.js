import express from 'express';

import {
  getMemberships,
  insertMembership,
  updateMembership,
  deleteMembership
} from './Membership.Controller';

const router = express.Router();

router.get('/', getMemberships);
router.post('/', insertMembership);
router.put('/:idMembresia', updateMembership);
router.delete('/:idMembresia', deleteMembership);

export default router;
