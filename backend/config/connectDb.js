// importing mongoose module
import mongoose from "mongoose";
//  function to connect to mongodb database
const connectDb = async () => {
    try {
        // MONGODB_URL is the mongo atlas connection string stored in .env file
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb