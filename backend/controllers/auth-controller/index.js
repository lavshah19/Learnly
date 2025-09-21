const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, password } = req.body;
        const user = await User.findOne({ userEmail });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            userEmail,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { userEmail, password } = req.body;
        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign({
             userId: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
         }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user:{
                userId: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
module.exports = { registerUser, loginUser };
