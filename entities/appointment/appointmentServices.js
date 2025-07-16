// entities/appointment/appointmentService.js

const Appointment = require('./model/appointmentModel');

const createAppointment = async (data) => {
    try {
        const appointment = new Appointment(data);
        return await appointment.save();
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }
};

const getAllAppointments = async () => {
    try {
        return await Appointment.find();
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        throw error;
    }
};

const getAllBusinessAppointmentsByBusinessId = async (businessId) => {
    try {
        return await Appointment.find({ businessId: businessId });
    } catch (error) {
        console.error(`Error fetching appointments for businessId ${businessId}:`, error);
        throw error;
    }
};
const getAllAppointmentsByPhoneNumber = async (phoneNumber) => {
    try {
        return await Appointment.find({ customerPhone: phoneNumber });
    } catch (error) {
        console.error(`Error fetching appointments with phone number:`, error);
        throw error;
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAllBusinessAppointmentsByBusinessId,
    getAllAppointmentsByPhoneNumber
};
