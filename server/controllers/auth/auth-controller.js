const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, userName: user.userName},
      process.env.JWT_SECRET || "neeraj_secret_key",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      message: "Login successfull",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  try {
    // If using JWT in headers → client just deletes token
    // If using cookies → clear cookie
    res.clearCookie("token"); 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// MIDDLEWARE (protect routes)
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
  try {
    const decoded = jwt.verify(token, 'neeraj_secret_key');
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Unauthorised user!"});
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
