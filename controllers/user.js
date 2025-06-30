const User = require("../models/user.js");

module.exports.renderSignupform=(req,res)=>{
        res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
   try{
     let{username,email,password}=req.body;
    let newuser=new User({email,username});

    const registereduser=await User.register(newuser,password);
    req.login(registereduser,(err)=>{
        if(err){
                next(err);
        }
           req.flash("sucess","welcome to wanderlust");
    res.redirect("/listings");

    });

 
   }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }
};

module.exports.loginform=(req,res)=>{
        res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
     req.flash("sucess","welcome to wanderlust");
     const redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
   req.logOut((err)=>{
      if(err){
        return  next(err);
      }
      req.flash("sucess","you are logged out");
      res.redirect("/listings");
   });
};