const { EsewaInitiatePayment,paymentStatus } = require("../../controllers/student-controller/esewa-controller");
const express = require("express");
const router = express.Router();
router.post("/initiate-payment", EsewaInitiatePayment);
router.post("/payment-status", paymentStatus);
module.exports = router;