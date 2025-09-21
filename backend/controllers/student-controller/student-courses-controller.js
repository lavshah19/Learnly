const StudentCourses = require("../../models/studentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentBoughtCourses) {
      return res.status(200).json({
        success: true,
        data: [], // return empty array if no courses found
      });
    }

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getCoursesByStudentId };
