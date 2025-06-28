const cors = require('cors');

const corsOptions = {
    origin: '*', // Allow all origins; adjust as needed for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
