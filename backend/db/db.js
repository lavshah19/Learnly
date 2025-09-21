const mongoose = require("mongoose");
exports.connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected :) ");

    }catch(error){
        console.log("Database connection failed :(",error);
        process.exit(1);
    }
}