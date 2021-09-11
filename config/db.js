import mongoose from "mongoose";


const mongoClient = async () => {
    try {
        if(!process.env.MONGO_CLIENT){
            console.log('MONGO_CLIENT is not defined, please create MONGO_CLIENT and provide a mongoDB connection string')
        }
        const con = await mongoose.connect(process.env.MONGO_CLIENT)
        if(con){
           return console.log('mongoDB connected')
        }
        console.log('failed to connect mongoDB')
    } catch (error) {
        console.log(error)
    }
}

export default mongoClient