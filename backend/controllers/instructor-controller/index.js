const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    if (!coursesList) {
      return res.status(404).json({
        success: false,
        message: "No course found!",

      });
    }
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const ToggleIsPublised=async (req, res) => {
  try {
    const { id } = req.params;
     const course = await Course.findById(id);
     if(!course){
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
     }
     course.isPublised = !course.isPublised;
     await course.save();
     res.status(200).json({
      success: true,
      message: course.isPublised ? "Course published successfully" : "Course unpublished successfully",
      data: course,
    });

  }
  catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  ToggleIsPublised
};