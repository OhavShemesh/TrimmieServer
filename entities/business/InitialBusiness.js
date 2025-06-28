const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Business = require('./models/businessModel');

dotenv.config();

const initialBusinesses = [
    {
        name: 'Trimmie Barbershop',
        phone: 1234567890,
        email: 'info@Trimmie.com',
        address: {
            city: 'תל אביב',
            streetAddress: 'רחוב ראשי 123',
        },
        for: "male",
        services: ["תספורת גברים", "תספורת גברים + זקן", "תספורת נשים"],
        ownerId: new mongoose.Types.ObjectId(),
    },
    {
        name: 'Sharp Cuts Salon',
        phone: 9876543210,
        email: 'contact@sharpcuts.com',
        address: {
            city: 'ירושלים',
            streetAddress: "רחוב קינג גורג' 123",
        },
        for: 'female',
        services: ["תספורת גברים", "תספורת גברים + זקן", "תספורת נשים"],
        ownerId: new mongoose.Types.ObjectId(),
    }, {
        name: 'Jackie Barbershop',
        phone: 1234567890,
        email: 'info@Trimmie.com',
        address: {
            city: 'תל אביב',
            streetAddress: 'רחוב ראשי 123',
        },
        for: 'unisex',
        services: ["תספורת גברים", "תספורת גברים + זקן"],
        ownerId: new mongoose.Types.ObjectId(),
    }
];

async function uploadInitialBusiness() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Business.insertMany(initialBusinesses);
        console.log('Initial businesses uploaded successfully!');
    } catch (err) {
        console.error('Error uploading initial businesses:', err);
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = uploadInitialBusiness;
