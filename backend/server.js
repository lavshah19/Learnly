require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./db/db");
const authRoutes = require("./routes/auth-routes");
const mediaRoutes = require("./routes/instructor-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentCourseRoutes = require("./routes/student-routes/course-routes");
const studentPaymentRoutes = require("./routes/student-routes/payment-routes");
const bodyParser = require("body-parser");
const studentMyCoursesRoutes = require("./routes/student-routes/student-courses-routes"); 
const studentMyCoursesProgressRoutes = require("./routes/student-routes/course-progress-routes");
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders:["Content-Type","Authorization"],
    // credentials: true

}
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => { // global error handler
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong", 
    })
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/instructor/course", instructorCourseRoutes);
app.use("/api/student/course", studentCourseRoutes);
app.use("/api/student/payment", studentPaymentRoutes);
app.use("/api/student/my-courses", studentMyCoursesRoutes);
app.use("/api/student/course-progress", studentMyCoursesProgressRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} :)`);
});