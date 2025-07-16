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
const getBusinessByName = async (name) => {
    try {
        const business = Business.findOne({ name: name })
        return business
    } catch (error) {
        console.error("Error fetching business by name:", error);
        return { success: false, message: "Server error" };

    }
}

module.exports = {
    createBusiness,
    getAllBusinesses,
    getBusinessByBusinessId,
    updateAvailableAppointmentsByBusinessId,
    removeFromAvailableAppointments,
    getBusinessByName
};
