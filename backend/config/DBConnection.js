const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(conn.connection.host);
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDB;