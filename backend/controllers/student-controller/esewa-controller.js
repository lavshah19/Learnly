
const { EsewaPaymentGateway, EsewaCheckStatus } = require('../../utils/esewa');
const Order = require("../../models/order");
const StudentCourses = require("../../models/studentCourses");
const Course = require("../../models/Course");

const EsewaInitiatePayment = async (req, res) => {
  //data coming from frontend
     const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;
  try {
    // console.log(req.body, "req.body");
    
    const reqPayment = await EsewaPaymentGateway(
    Number(coursePricing),
      0,
      0,
      0,
      paymentId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );
    if (!reqPayment) {
      return res.status(400).json("error sending data");
    }
    // console.log(reqPayment, "reqPayment");
    if (reqPayment.status === 200) {
        const order = new Order({
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing
        })
        await order.save();
      // console.log("transaction passed   ");
      return res.send({
        success: true,
        orderId: order._id,
        url: reqPayment.request.res.responseUrl,
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

const paymentStatus = async (req, res) => {
   const { paymentId } = req.body; // Extract data from request body
  try {
    let order = await Order.findOne({paymentId});

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }


    const paymentStatusCheck = await EsewaCheckStatus(
      order.coursePricing,
      order.paymentId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    // console.log(paymentStatusCheck,"paymentStatusCheck");

    if (paymentStatusCheck.status === 200) {
     order.paymentStatus = "paid";
    order.orderStatus = paymentStatusCheck.data.status;
    

    await order.save();

    //update student courses
     const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    //update the course schema students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

      return res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { EsewaInitiatePayment, paymentStatus };
