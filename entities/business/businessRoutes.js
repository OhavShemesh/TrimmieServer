// entities/business/businessRoutes.js

const express = require("express");
const router = express.Router();

const {
    createBusiness,
    getAllBusinesses,
    getBusinessByBusinessId,
    updateAvailableAppointmentsByBusinessId,
    removeFromAvailableAppointments,
    getBusinessByName,
} = require("./businessService");

// Get all businesses
router.get("/", async (req, res) => {
    try {
        const businesses = await getAllBusinesses();
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create business
router.post("/", async (req, res) => {
    try {
        const business = await createBusiness(req.body);
        res.status(201).json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Initial business creation (demo)
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
            ownerId: null,
        };
        const business = await createBusiness(initialBusiness);
        res.status(201).json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get business by ID
router.get("/getBusinessByBusinessId", async (req, res) => {
    try {
        const { businessId } = req.query;
        const business = await getBusinessByBusinessId(businessId);
        res.json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update available appointments
router.patch("/updateAvailableAppointmentsByBusinessId", async (req, res) => {
    try {
        const { availableAppointments, businessId } = req.body;
        const updated = await updateAvailableAppointmentsByBusinessId(availableAppointments, businessId);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/removeFromAvailableAppointments", async (req, res) => {
    try {
        const { businessId, date, time } = req.body;
        const result = await removeFromAvailableAppointments(businessId, date, time);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/getBusinessByName", async (req, res) => {
    try {
        const { name } = req.query
        const business = await getBusinessByName(name)
        res.json(business)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
module.exports = router;
