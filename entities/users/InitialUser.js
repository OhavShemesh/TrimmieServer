const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../users/models/userModel");

dotenv.config();

const adminUser = {
    name: "Ohav",
    username: "admin123",
    password: "1234",
    isAdmin: true,
    businessId: new mongoose.Types.ObjectId(), // Replace if needed
};

const regularUser = {
    name: "Ofek",
    username: "user123",
    password: "abcd",
    isAdmin: false,
};

async function uploadInitialUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Insert admin user if not exists
        const existingAdmin = await User.findOne({ username: adminUser.username });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            const newAdmin = new User({
                name: adminUser.name,
                username: adminUser.username,
                password: hashedPassword,
                isAdmin: adminUser.isAdmin,
                businessId: adminUser.businessId,
            });
            await newAdmin.save();
            console.log("Admin user created successfully.");
        } else {
            console.log("Admin user already exists.");
        }

        // Insert regular user if not exists
        const existingUser = await User.findOne({ username: regularUser.username });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(regularUser.password, 10);
            const newUser = new User({
                name: regularUser.name,
                username: regularUser.username,
                password: hashedPassword,
                isAdmin: regularUser.isAdmin,
            });
            await newUser.save();
            console.log("Regular user created successfully.");
            console.log("User businessId:", newUser.businessId.toString());
        } else {
            console.log("Regular user already exists.");
        }

    } catch (err) {
        console.error("Error uploading initial users:", err);
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = uploadInitialUsers;
