const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
// const MONGODB_URI = process.env.MONGODB_URI;
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const connectDatabase =  () => {
 
    mongoose
        .connect(process.env.MONGODB_URI)
        .then((data) => {
            console.log(`MongoDb is connected with server ${data.connection.host}`);
        })
    console.log(`mongo database is connected!!! `);
 
};

module.exports = connectDatabase;

// export default connectDB;
