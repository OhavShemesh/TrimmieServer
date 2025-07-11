// entities/appointment/appointmentService.js

const Appointment = require('./model/appointmentModel');

const createAppointment = async (data) => {
    const appointment = new Appointment(data);
    return await appointment.save();
};

const getAllAppointments = async () => {
    return await Appointment.find();
};

const getAllBusinessAppointmentsByBusinessId = async (businessId) => {
    return await Appointment.find({ businessId: businessId });
};

module.exports = { createAppointment, getAllAppointments, getAllBusinessAppointmentsByBusinessId };
