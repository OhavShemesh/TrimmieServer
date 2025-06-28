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
    services: [String],
    ownerId: mongoose.Schema.Types.ObjectId, // If users own businesses
});

module.exports = mongoose.model('Business', BusinessSchema);
