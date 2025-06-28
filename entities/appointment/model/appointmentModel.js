const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    scheduledAt: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "confirmed",
        enum: ["confirmed", "cancelled"]
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
