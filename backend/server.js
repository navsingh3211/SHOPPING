const app = require('./app');

const dotenv=require('dotenv');

const connectDatabase=require('./config/database');

//Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting Down Server due to uncaught exception");
    process.exit(1);
});
// console.log(youtube);



//Config
dotenv.config({path:"backend/config/config.env"});


//connecting to database
connectDatabase();


const server=app.listen(process.env.PORT, () => {
    console.log(`server is working on port ${process.env.PORT}`);
});


//unhandled promise rejection (when passing invalida promise[passing wrong db url]) 
process.on("unhandledRejection", err => {
    console.log(`Error:${err.message}`);
    console.log("Shutting Down Server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});
