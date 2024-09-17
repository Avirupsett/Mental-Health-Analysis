import mongoose from "mongoose";
async function ConnectDB() {

    const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.1oksn.mongodb.net/?retryWrites=true&w=majority`;

    let client;

    try {
        client = await mongoose.connect(MONGODB_URI);
    } catch (error) {
        console.log("There was an error connection to the DB", error);
    }
    return client
}
export default ConnectDB;