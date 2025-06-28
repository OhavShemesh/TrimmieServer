require("dotenv").config(); // load .env variables (make sure this is at the very top of your app entry point as well)
const User = require("./models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { username, password, businessId } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            businessId,
        });

        await newUser.save();
        res.status(201).json({ msg: "Business user registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {

        const { username, password } = req.body;

        console.log("username", username);
        console.log("password", password);

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                businessId: user.businessId,
                isAdmin: true
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};
const getAllUsers = async () => {
    try {
        const allUsers = await User.find()
        return allUsers
    } catch (err) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};
