const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
const connectToMongoDB = require("./config/connectToMongoDB");
connectToMongoDB();

// Import cleanup function
const cleanupOldAppointments = require("./utils/cleanupOldAppointments");

// Routes
const businessRoutes = require("./entities/business/businessRoutes");
const appointmentRoutes = require("./entities/appointment/appointmentRoutes");
const userRoutes = require("./entities/users/userRoutes");
const { getAllBusinesses } = require("./entities/business/businessService");
const { getAllUsers } = require("./entities/users/userService");

app.use("/businesses", businessRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", userRoutes);

// Optionally seed initial business if SEED_INITIAL_BUSINESS is set
const seedInitialBusiness = async () => {
    const isSeeded = await getAllBusinesses();
    if (isSeeded.length === 0) {
        const uploadInitialBusiness = require('./entities/business/InitialBusiness');
        uploadInitialBusiness();
    }
};

seedInitialBusiness();

const seedInitialUser = async () => {
    const isSeeded = await getAllUsers();
    if (isSeeded.length === 0) {
        const uploadInitialUser = require('./entities/users/InitialUser');
        uploadInitialUser();
    }
};

seedInitialUser();

// Run cleanup once immediately on server start
cleanupOldAppointments()
    .then(() => console.log("Initial cleanup of old appointments done"))
    .catch((err) => console.error("Error on initial cleanup:", err));

// Schedule cleanup of old appointments every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup of old appointments at midnight...");
    await cleanupOldAppointments();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
