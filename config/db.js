const mongoose = require("mongoose");
require("dotenv/config");

const db = process.env.db;
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.error("Error", err.message);
    //exit process wiz failure
    process.exit(1);
  }
};

module.exports = connectDB;
