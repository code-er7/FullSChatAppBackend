import mongoose from "mongoose";

const connectDB = async()=>{
     mongoose.connect(process.env.MONGO_URI, { dbName: "ChatApplication" })
        .then(() => console.log("Database Connected"))
        .catch((e) => console.log(e))
}
export default connectDB;