if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
      
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const User=require("./models/user.js");
const passport=require("passport");
const LocalStargey=require("passport-local");

const MongoStore = require('connect-mongo');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

let sessionOptions={
  store,
  secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie: {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
}

};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStargey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  
  res.locals.sucess=req.flash("sucess");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});



// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
