const Course = require("../../models/Course");
const StudentCourses = require("../../models/studentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = { isPublised: true }; // ✅ only published courses

    if (category.length) {
      filters.category = { $in: category.split(",") }; //split will convert string into array
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    const sortOptions = {
      "price-lowtohigh": { pricing: 1 },
      "price-hightolow": { pricing: -1 },
      "title-atoz": { title: 1 },
      "title-ztoa": { title: -1 },
    };
    const sortParam = sortOptions[sortBy] || { pricing: 1 };

    const coursesList = await Course.find(filters).sort(sortParam);

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


const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
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

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentCourses) {
      return res.status(200).json({
        success: true,
        data: false, // student has not bought anything yet
      });
    }

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1;

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};