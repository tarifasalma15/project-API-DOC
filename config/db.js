const mongoose = require ('mongoose')
const colors = require ('colors')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL ,  {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000, 
        });
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Mongodb server issue ${error}`.bgRed.white);
    }
};

module.exports = connectDB; 