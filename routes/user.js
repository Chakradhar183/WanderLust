const express = require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const UserController=require("../controllers/user.js");

router.get("/signup",UserController.renderSignupform);

router.post("/signup",wrapAsync(UserController.signup));

router.get("/login",UserController.loginform);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}) ,wrapAsync(UserController.login));

router.get("/logout",UserController.logout);


module.exports=router;