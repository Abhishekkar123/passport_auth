const express = require('express');
const app = express()
const userModel=require("./configs/database")
const mongoose=require('mongoose'); 
const session = require('express-session')
const bcrypt=require('bcrypt')
// const mongoStore=require('connect-mongo');
const MongoStore = require('connect-mongo');
const passport = require('passport');
//middleware


// mongoose.connect('mongodb://0.0.0.0/passport_db').then(()=>{"connected"}).catch(err=>console.log("errors"))
//routes
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}))
require('./configs/passport')


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0/passport_db', collectionName: "sessions" }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world 1")
})

//app.get("/login",passport.authenticate('local',{ successRedirect: 'protected'}))

app.get("/register",(req,res)=>{
    res.render("register")
})


app.get("/login",(req,res)=>{
    res.render('login')
})

app.post('/login', passport.authenticate('local', { successRedirect: 'protected' }))

app.post("/register",async(req,res)=>{
  try{
    let user=new userModel({
    username:req.body.username,
    password:bcrypt.hashSync(req.body.password,10)
   })
   console.log(user)
   const users = await user.save();
    res.status(200).json(users);
}
catch(err){
    console.log(err);
    res.status(500).json(err);

}

//    user.save().then(user=> console.log("user",user))
//    res.send({sucess:true});
})

app.get("/protected",(req,res)=>{

    if(req.isAuthenticated()){
       
        res.send("protected page")
    }else{
        res.status(401).send({msg:"Unauthorized"})
    }
    console.log(req.session);
        console.log(req.user)
})
app.get("/logout",(req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err); // Pass any error to the next middleware
        }
        // Redirect to the login page after successful logout
        res.redirect('/login');
    });
})


//listen


app.listen(8000,(req,res)=>{
console.log("this is in port 8000");
})