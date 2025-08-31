import mongoose from 'mongoose';

export default async function connectDB() {
    if (!process.env.MONGO_URI) {
        console.log("No environment variable 'MONGO_URI' found or unable to configure enviroment variables");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected");
    } catch (e) {
        console.log("Error connecting with Database.");
        process.exit(1);
    }
}