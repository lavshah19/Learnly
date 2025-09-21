const express = require("express");
const {
  getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");
const authMiddleware=require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get",authMiddleware,getCoursesByStudentId);

module.exports = router;