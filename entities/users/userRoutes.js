const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserById } = require("../users/userService");

// POST /users/register
router.post("/register", registerUser);

// POST /users/login
router.post("/login", loginUser);
router.get("/getUserById", getUserById)
module.exports = router;
