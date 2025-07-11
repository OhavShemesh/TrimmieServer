const mongoose = require('mongoose');
const Business = require('..//entities/business/models/businessModel');
const Appointment = require('../entities/appointment/model/appointmentModel');

// Utility: Convert "DD.MM.YYYY" string to Date object
const parseDateString = (str) => {
    const [day, month, year] = str.split('.').map(Number);
    return new Date(year, month - 1, day); // JS months are 0-based
};

const cleanupOldAppointments = async () => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Today at midnight

        // 1. Clean up appointments from Appointment collection
        const allAppointments = await Appointment.find({});
        const toDelete = allAppointments.filter((a) => {
            const dateStr = a.scheduledAt?.split(" ")[0];
            if (!dateStr) return false;
            const appointmentDate = parseDateString(dateStr);
            return appointmentDate < today;
        });

        if (toDelete.length > 0) {
            const deleteIds = toDelete.map((a) => a._id);
            await Appointment.deleteMany({ _id: { $in: deleteIds } });
            console.log(`Deleted ${deleteIds.length} outdated appointments.`);
        } else {
            console.log("No outdated appointments found.");
        }

        // 2. Clean outdated dates from each business's availableAppointments
        const allBusinesses = await Business.find({});
        let modifiedCount = 0;

        for (const biz of allBusinesses) {
            const originalLength = biz.availableAppointments.length;

            // Filter only valid upcoming dates
            biz.availableAppointments = biz.availableAppointments.filter((entry) => {
                const entryDate = parseDateString(entry.date);
                return entryDate >= today;
            });

            if (biz.availableAppointments.length !== originalLength) {
                await biz.save();
                modifiedCount++;
            }
        }

        console.log(`Cleaned up outdated availableAppointments from ${modifiedCount} businesses.`);

    } catch (err) {
        console.error("Error during cleanupOldAppointments:", err);
    }
};

module.exports = cleanupOldAppointments;
