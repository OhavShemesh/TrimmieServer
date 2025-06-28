const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
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
    availableAppointments: [{ date: String, times: [] }],
    ownerId: mongoose.Schema.Types.ObjectId, // If users own businesses
});

module.exports = mongoose.model('Business', BusinessSchema);
