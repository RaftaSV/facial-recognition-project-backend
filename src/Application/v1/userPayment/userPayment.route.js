import Express  from "express";
import {
    getUserPayments,
    insertUserPayment,
    updateUserPayment,
    deleteUserPayment
}
from "./userPayment.Controller";

const router = Express.Router();

router.get("/:idUsuario", getUserPayments);
router.get("/", getUserPayments);
router.post("/", insertUserPayment);
router.put("/:idPago", updateUserPayment);
router.delete("/:idPago", deleteUserPayment);

export default router;