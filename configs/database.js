const mongoose= require('mongoose');


//mongodb://localhost:27017
console.log("start")

mongoose.connect('mongodb://0.0.0.0/passport_db')

;

console.log("end")
//connect is proper or not?
const db=mongoose.connection;
// console.log(db)

db.on("error",()=>{
    console.log("error in db")
})
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
    // Perform any operations here upon successful connection
});



const userSchema=mongoose.Schema({
    username:String,
    password: String
})


//model creating

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;