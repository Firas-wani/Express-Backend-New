const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const { messageHandler } = require("../../utils/utils");
const { config } = require("dotenv");
config("/.env");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const transporter = require("../../utils/nodeMailer");

// handle signup
const handleSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username !== "" && email !== "" && password !== "") {
      const findAccount = await User.findOne({ email });
      if (findAccount) {
        res.json({ msg: "user already exists" });
      } else {
        const hashPass = await bcrypt.hash(password, 10);
        const newAccount = await User.create({
          username,
          email,
          password: hashPass,
        });
        if (newAccount) {
          // const baseUrl = "mongodb://localhost:27017/newdb";
          const baseUrl = "http://localhost:3000";
          const link = `${baseUrl}/verify/email/${newAccount._id}`;
          const data = `Your account has been registered with Us ... kindly click on the below link    ${link} to actiavte your account  and confirm you Email`;

          const mail = await transporter.sendMail({
            // from: "wanifiras7@gmail.com",
            from: process.env.ADMIN_EMAIL,
            to: `${email}`,
            subject: `Welecome ${username}`,
            text: data,
          });
          if (newAccount && mail) {
            res.json({ msg: "User created successfully" });
          } else {
            res.json({ msg: "all credentials required" });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
// login handler

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return messageHandler(res, 203, "all credentials required");
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return messageHandler(res, 203, "User Not Found");
    }
    const checkPass = await bcrypt.compare(password, existingUser.password);
    if (!checkPass) {
      return messageHandler(res, 203, "Password Incorrect");
    } else {
      const payload = existingUser._id;
      const token = await jwt.sign({ _id: payload }, secretKey);

      if (token) {
        res.cookie("token", token);
        res.status(201).json({ message: "user logged in" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// get user details

const getUserDetails = async (req, res) => {
  try {
    const _id = req.user;
    if (_id) {
      const getUser = await User.findById(_id).populate("orders");
      return res.json({ userDetails: getUser });
    }
  } catch (error) {
    console.log(error);
  }
};

// edit user

const editUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const _id = req.user;
    const findUser = await User.findById(_id);
    if (findUser) {
      const hashPass = await bcrypt.hash(password, 10);
      const editUser = await User.findByIdAndUpdate(_id, {
        email,
        username,
        password: hashPass,
      });
    }
    if (editUser) {
      return messageHandler(res, 202, "User Updated Successfully");
    } else {
      res.json({ message: "Some Error" });
    }
  } catch (error) {
    console.log(error);
  }
};

// delete user

const deleteUser = async (req, res) => {
  try {
    const id = req.user;
    if (id) {
      const deleteUser = await User.findByIdAndDelete(id);
      if (deleteUser) {
        return messageHandler(res, 200, "User Deleted");
      } else {
        res.json({ message: "no user" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// logout

const handleLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    return messageHandler(res, 200, "User Logged out successfully ");
  } catch (error) {
    console.log(error);
  }
};

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "1h" });

    // Create a reset password link
    const baseUrl = "http://localhost:3000"; 
    const resetLink = `${baseUrl}/reset-password/${resetToken}`;

    // Email message body
    const message = `
      Hi ${user.username}, 

      We received a request to reset your password. Click the link below to reset it: 
      ${resetLink}

      If you did not request a password reset, please ignore this email.
      
      The link will expire in 1 hour.

      Regards, 
      Your App Team
    `;

    // Send email with reset link
    const mail = await transporter.sendMail({
      from: "wanifiras7@gmail.com",
      to: `${email}`,
      subject: "Password Reset Request",
      text: message,
    });

    if (mail) {
      return res.status(200).json({ msg: "Password reset link sent to your email" });
    } else {
      return res.status(500).json({ msg: "Error sending reset email" });
    }
  } catch (error) {
    console.error("Error in handleForgotPassword:", error);
    return res.status(500).json({ msg: "An error occurred. Please try again later." });
  }
};
const handleResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded._id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Invalid token or user does not exist" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ msg: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in handleResetPassword:", error);
    return res.status(500).json({ msg: "An error occurred. Please try again later." });
  }
};

module.exports = {
  handleSignUp,
  handleLogin,
  getUserDetails,
  editUser,
  deleteUser,
  handleLogout,
  handleForgotPassword ,
  handleResetPassword,
};
