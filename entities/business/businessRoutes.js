// entities/business/businessRoutes.js

const express = require("express");
const router = express.Router();

const {
    createBusiness,
    getAllBusinesses,
} = require("./businessService");

router.get("/", async (req, res) => {
    try {
        const businesses = await getAllBusinesses();
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const business = await createBusiness(req.body);
        res.status(201).json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this route for uploading an initial business
router.post('/init', async (req, res) => {
    try {
        const initialBusiness = {
            name: 'Trimmie Barbershop',
            phone: 1234567890,
            email: 'info@Trimmie.com',
            address: {
                city: 'Tel Aviv',
                streetAddress: '123 Main St',
            },
            ownerId: null, // Set to a real user ID if needed
        };
        const business = await createBusiness(initialBusiness);
        res.status(201).json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // ✅ IMPORTANT!
