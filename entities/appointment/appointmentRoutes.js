const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAllAppointments,
} = require("./appointmentServices");

router.get("/", async (req, res) => {
    try {
        const appointments = await getAllAppointments();
        res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
});

router.post("/", async (req, res) => {
    try {
        const appointment = await createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // ✅ MUST export the router
