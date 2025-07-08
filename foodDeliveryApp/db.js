const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Schema =mongoose.Schema;
 
 
dotenv.config();
const connectDatabase = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected successfully")
    }catch(e){
        console.error("something went wrong "+e);
        process.exit(1);
    }
}

const userSchema = new Schema({
    username: {type: String},
    email:{type: String, unique: true},
    password: String
})

const userModel = mongoose.model('user',userSchema);
module.exports = {
    userModel,
    connectDatabase
}