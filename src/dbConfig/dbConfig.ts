import mongoose from "mongoose";


process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
  });
export default async function dbConfig() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection
        connection.once('open', () => {
            console.log("Database connected successfully");
        });

        connection.on('error', (err) => {
            console.log("Error in connecting to the database: ", err);

            process.exit();
        });
    } catch (error: any) {
        throw new Error("Error in connecting to the database", error.message);
    }
}