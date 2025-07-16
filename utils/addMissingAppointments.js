const mongoose = require('mongoose');
const Business = require('../entities/business/models/businessModel');


const addMissingAppointments = async () => {
    try {
        const businesses = await Business.find(); // Await here!

        const results = [];

        for (const business of businesses) {
            if (!business) {
                results.push({ success: false, message: "Business not found" });
                continue;
            }

            const openingHour = business.workingHours?.[0]?.openingHour;
            const closingHour = business.workingHours?.[0]?.closingHour;

            if (!openingHour || !closingHour) {
                results.push({ success: false, message: "Working hours not defined" });
                continue;
            }

            const generateTimeSlots = (openingHour, closingHour) => {
                const [startH, startM = 0] = openingHour.split(":").map(Number);
                const [endH, endM = 0] = closingHour.split(":").map(Number);
                const slots = [];

                for (let hour = startH; hour < endH; hour++) {
                    for (let min = 0; min < 60; min += 10) {
                        slots.push(`${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
                    }
                }

                if (endM > 0) {
                    slots.push(`${endH.toString().padStart(2, "0")}:00`);
                }

                return slots;
            };

            const today = new Date();
            const existingDates = business.availableAppointments.map(app => app.date);

            const newDates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(today.getDate() + i);

                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                const formattedDate = `${day}.${month}.${year}`;

                if (!existingDates.includes(formattedDate)) {
                    newDates.push({
                        date: formattedDate,
                        times: generateTimeSlots(openingHour, closingHour)
                    });
                }
            }

            if (newDates.length) {
                business.availableAppointments.push(...newDates);
                await business.save();
            }

            results.push({ success: true, businessId: business._id, added: newDates.length, addedDates: newDates.map(d => d.date) });
        }

        return results;

    } catch (error) {
        console.error("Error adding missing appointments:", error);
        return { success: false, message: "Server error" };
    }
};

module.exports = addMissingAppointments;
