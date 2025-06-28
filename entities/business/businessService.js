const Business = require('./models/businessModel');

const createBusiness = async (data) => {
    const business = new Business(data);
    return await business.save();
};

const getAllBusinesses = async () => {
    return await Business.find();
};

module.exports = { createBusiness, getAllBusinesses };
