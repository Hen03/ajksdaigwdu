let mongoose = require('mongoose');
let { MongoURL } = require("../config/config.json");
let connectDB = async () => {
    try {
        let conn = await mongoose.connect(MongoURL);
        console.log("----------------------------------------".yellow);
        console.log(`MONGO DB: ${conn.connection.host}`.green.underline);
        console.log("----------------------------------------".yellow);
    } catch (error) {
        console.log(`[SYSTEM ERROR]`.bgRed.bold, `Already Error In MongoDB!\n${error}`.red)
        process.exit(1);
    }
}

module.exports = connectDB