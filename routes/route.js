const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require("fs");

// Multer configuration for file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Authentication failed' });
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Authentication failed' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route
router.get("/protected", verifyToken, async (req, res) => {
  try {
    // Retrieve protected data
    res.json({ message: "Access granted. You are authenticated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Access denied. Token is missing." });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid token." });
    req.userId = decoded.id;
    next();
  });
}

// Insert a user to the database
router.post("/add", upload, async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });
    await newUser.save();
    req.session.message = {
      type: "success",
      message: "User added successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { title: "HOME PAGE", users: users });
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Render add user page
router.get("/add", (req, res) => {
  res.render("add_user", { title: "add users" });
});

// Edit user route
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    if (!user) {
      return res.redirect("/");
    }
    res.render("edit_users", { title: "edit user", user: user });
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Update user route
router.post("/update/:id", upload, async (req, res) => {
  try {
    let id = req.params.id;
    let new_image = "";
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }
    const result = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });
    if (!result) {
      return res.redirect("/");
    }
    req.session.message = {
      type: "success",
      message: "User updated successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});
//delete the user
// Delete user route
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if (result.image !== '') {
      try {
        fs.unlinkSync('./uploads/' + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: 'info',
        message: 'User deleted successfully'
      };
      res.redirect('/');
    }
  });
});
