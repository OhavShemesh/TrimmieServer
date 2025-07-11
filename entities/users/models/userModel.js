const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    password: {
        type: String,
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model("User", User);
