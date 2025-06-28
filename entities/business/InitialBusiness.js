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
        services: {
            men: [
                { type: "תספורת גברים", time: 20 },
                { type: "תספורת גברים + זקן", time: 30 }
            ]
        },
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
        services: {
            women: [
                { type: "פן", time: 25 },
                { type: "גוונים", time: 90 }
            ]
        },
        ownerId: new mongoose.Types.ObjectId(),
    },
    {
        name: 'Jackie Barbershop',
        phone: 1234567890,
        email: 'info@Trimmie.com',
        address: {
            city: 'תל אביב',
            streetAddress: 'רחוב ראשי 123',
        },
        for: 'unisex',
        services: {
            men: [
                { type: "תספורת גברים + זקן", time: 30 }
            ],
            women: [
                { type: "קצוות", time: 20 },
                { type: "גוונים", time: 90 }
            ]
        },
        ownerId: new mongoose.Types.ObjectId(),
    }
];

async function uploadInitialBusiness() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Business.deleteMany(); // optional: clear existing businesses
        await Business.insertMany(initialBusinesses);
        console.log('Initial businesses uploaded successfully!');
    } catch (err) {
        console.error('Error uploading initial businesses:', err);
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = uploadInitialBusiness;
