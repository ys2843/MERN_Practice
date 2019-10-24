const mongoos = require('mongoose');
const config = require('config');
const DBUrl = config.get('mongoURL');
const connectDB = async () => {
    try {
        await mongoos.connect(DBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("connected to database");
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

module.exports = connectDB;