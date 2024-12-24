const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Your name address is required"],
    
  },

  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
 
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  
});



module.exports = mongoose.model("User", userSchema);