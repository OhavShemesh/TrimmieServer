const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
const connectToMongoDB = require("./config/connectToMongoDB");
connectToMongoDB();

// Routes
const businessRoutes = require("./entities/business/businessRoutes");
const appointmentRoutes = require("./entities/appointment/appointmentRoutes");
const { getAllBusinesses } = require("./entities/business/businessService");

app.use("/businesses", businessRoutes);
app.use("/appointments", appointmentRoutes);

// Optionally seed initial business if SEED_INITIAL_BUSINESS is set
const seedInitialBusiness = async () => {
    const isSeeded = await getAllBusinesses()
    if (isSeeded.length === 0) {
        const uploadInitialBusiness = require('./entities/business/InitialBusiness');
        uploadInitialBusiness();
    }
}

seedInitialBusiness()


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
