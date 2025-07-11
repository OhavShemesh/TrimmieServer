const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        city: String,
        streetAddress: String,
    },
    for: {
        type: String,
        enum: ["male", "female", 'unisex']
    },
    services: [
        {
            men: [
                {
                    type: {
                        type: String,
                        required: true
                    },
                    time: {
                        type: Number,
                        required: true
                    },
                    _id: false
                }
            ],
            women: [
                {
                    type: {
                        type: String,
                        required: true
                    },
                    time: {
                        type: Number,
                        required: true
                    },
                    _id: false
                }
            ],
            _id: false
        },
    ],
    workingHours: [{ openingHour: { type: String, required: true }, closingHour: { type: String, required: true }, _id: false }],
    availableAppointments: [{ date: String, times: [] }],
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Business', BusinessSchema);
