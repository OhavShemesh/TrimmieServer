// entities/business/businessService.js

const Business = require('./models/businessModel');

// Create a new business
const createBusiness = async (data) => {
    try {
        const business = new Business(data);
        return await business.save();
    } catch (error) {
        console.error("Error creating business:", error);
        throw new Error("Failed to create business");
    }
};

// Get all businesses
const getAllBusinesses = async () => {
    try {
        return await Business.find();
    } catch (error) {
        console.error("Error retrieving businesses:", error);
        throw new Error("Failed to retrieve businesses");
    }
};

// Get a business by its businessId
const getBusinessByBusinessId = async (businessId) => {
    try {
        return await Business.findOne({ businessId });
    } catch (error) {
        console.error(`Error retrieving business with ID ${businessId}:`, error);
        throw new Error("Failed to retrieve business");
    }
};

// Update available appointments for a business by businessId
const updateAvailableAppointmentsByBusinessId = async (newAppointment, businessId) => {
    try {
        const business = await Business.findOne({ businessId });
        if (!business) {
            return { success: false, message: "Business not found" };
        }

        const { date, times } = newAppointment;

        const updatedAppointments = [...business.availableAppointments];
        const existingIndex = updatedAppointments.findIndex((appt) => appt.date === date);

        if (existingIndex !== -1) {
            updatedAppointments[existingIndex].times = times;
        } else {
            updatedAppointments.push({ date, times });
        }

        business.availableAppointments = updatedAppointments;
        await business.save();

        return { success: true, message: "Appointments updated" };
    } catch (error) {
        console.error(`Error updating appointments for business ID ${businessId}:`, error);
        return { success: false, message: "Failed to update appointments" };
    }
};

// ✅ NEW: Add missing dates only (preserve existing dates/times)
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

const removeFromAvailableAppointments = async (businessId, date, time) => {
    try {
        const business = await Business.findOne({ businessId })
        if (!business) return { success: false, message: "Business not found" };
        const availableAppointments = business.availableAppointments
        if (!availableAppointments) return { success: false, message: "availableAppointments not found" };
        const forDate = availableAppointments.find(obj => obj.date === date);
        if (!forDate) return { success: false, message: "forDate not found" };
        forDate.times = forDate.times.filter(t => t !== time);
        await business.save();
        return { success: true, message: "Time removed successfully" };
    } catch (error) {
        console.error("Error removing from missing appointments:", error);
        return { success: false, message: "Server error" };

    }
}

module.exports = {
    createBusiness,
    getAllBusinesses,
    getBusinessByBusinessId,
    updateAvailableAppointmentsByBusinessId,
    addMissingAppointments,
    removeFromAvailableAppointments
};
