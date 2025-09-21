const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  ToggleIsPublised
} = require("../../controllers/instructor-controller/index");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);
router.put("/toggle-publish/:id", ToggleIsPublised);

module.exports = router;