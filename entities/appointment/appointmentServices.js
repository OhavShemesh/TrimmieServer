// entities/appointment/appointmentService.js

const Appointment = require('./model/appointmentModel');

const createAppointment = async (data) => {
    const appointment = new Appointment(data);
    return await appointment.save();
};

const getAllAppointments = async () => {
    return await Appointment.find();
};

module.exports = { createAppointment, getAllAppointments };
