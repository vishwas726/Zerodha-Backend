const bcrypt = require("bcryptjs");
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const login = async (req, res) => {

  try {

    const { password, email } = req.body;

    if (!email || !password) {
      return res.status(300).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User dosent exists",
      });
    }

    if (await bcrypt.compare(password, user.password)) {

      const playload = {
        email: user.email,
        id: user._id,
      };

      let token = jwt.sign(playload, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly:true
      };

      res.cookie("token", token, options).status(200).json({
        success: false,
        message: "Login succefull",
        token,
        user,
      });

    } else {

      return res.status(403).json({
        success: false,
        message: "inccorect password",
      });

    }
  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Something went wrong Login again"
    })

  }
};

const signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!email || !password || !name) {
      return res.status(300).json({
        success: false,
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Alredy Exists",
      });
    }

    let hashedpassword;

    try {
      hashedpassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Problem in hashing",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    return res.status(200).json({
      success: false,
      message: "User created succefully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "user cant be register please try again later",
    });
  }
};

// Export both functions
module.exports = { login, signup };
