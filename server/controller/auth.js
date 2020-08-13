const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");



const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b995a82c93a99c",
    pass: "74db0dfc8364c9"
  }
});



exports.signup = (req, res) =>{
  const {name, email, password} = req.body;
  // console.log(email);

  User.findOne({email}).exec((err, user) =>{
    if(err){
      console.log("server error 1");
      return res.status(401).json({
        error:"Something Wrong"
      });
    }

      if(user){
        console.log("server error 2");
        return res.status(400).json({
          error: "Email already exists!!"
        });
      }

      const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: "1h"});

      const activateLink = `${process.env.CLIENT_URL}/auth/activate/${token}`;

      const emailData = {
        to:[
          {
            address: email,
            name,
          }
        ],
        from:{
          address:process.env.EMAIL_FROM,
          name:"Auth System"
        },

        subject:"Account Activation Link",
        html:`
        <div>
        <h1>Please click this link to activate the account</h1>

        <a href="${activateLink}" target = "_blank">${activateLink}</a>

        <hr/>

        <a href="${process.env.CLIENT_URL}" target = "_blank">${process.env.CLIENT_URL}</a>
        </div>
        `
      };

      transport.sendMail(emailData, (err, info)=>{
        if(err){
          // console.log(err);
          return res.status(401).json({
            error: err,
          });
        }


        return res.json({
          message:`Email has been successfully sent to ${email}. follow the instructions to active the account.`,
        });
      });

  });
};



exports.activateAccount = (req, res)=> {
  const {token} = req.body;
  if(token){
    return jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err)=>{
      if(err)
      {
        return res.status(401).json({
          error: "The link has expired.",
        });
      }

      const {email,name, password} = jwt.decode(token);

      const newUser = new User({email, name, password});

      User.findOne({email}).exec((err,user)=>{
        if(err){
          return res.status(400).json({
            error:"Something went wrong",
          });
        }

        if(user)
        {
          return res.status(400).json({
            error:"this account has been already activated",
          });
        }

        newUser.save((err, userData)=>{
          if(err){
            return res.status(400).json({
              error:"something went wrong",
            });
          }
          return res.json({
              message:`Hi ${name} welcome to the application.`,
          });
        });
      });
    });
  };
  return res.status(401).json({
    error:"the link is invalid",
  });
};



exports.signin = (req,res) =>{
  const {email, password} = req.body;

  User.findOne({email}).exec((err, user)=>{
    if(err || !user){
      return res.status(400).json({
        error:"The user with email or username doesn't exist.",
      });
    }

    if(!user.authentication(password)){
        return res.status(400).json({
          error:"Invalid password",
        });
    }

    const token = jwt.sign((_id= user._id), process.env.JWT_SECRET_KEY, {expiresIn:"7d",});

    const {_id, name, email, role,} = user;

    return res.json({
      token,
      user: {
        _id, name, role, email,
      },
      message:"you are successfully logged In.",
    });
  })
};



exports.forgotPassword = (req, res) => {
  const {email} = req.body;

  User.findOne({email}).exec((err,user)=> {
  if(err || !user){
    res.status(400).json({
      error:"User with this email doesn't exist.",
    });
  }

  const token = jwt.sign({_id : user._id, name: user.name}, process.env.JWT_RESET_PASSWORD, {expiresIn: "10h",});

  const link = `${process.env.CLIENT_URL}/auth/password/reset/${token}`;

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "FORGOT PASSWORD LINK",
    html:`
    <h1>To reset the password. Click on this link:</h1>

    <a href ="${link}" target= "_blank">${link}</a>`,
  };

  return user.updateOne({resetPasswordLink: token}).exec((err, success)=>{
    if(err){
      return res.status(400).json({
        error:"something went wrong in saving the reset link.",
      });
    }

    transport.sendMail(emailData)
    .then(() =>{
      return res.json({
        message:`Email has been sent to ${email}`
      });
    })
    .catch((err)=>{
        return res.status(400).json({
          error:"ther was some error in sending the reset password link.",
        });
      });
    });
  });
};



exports.resetPassword = (req, res) =>{
  const {resetPasswordLink, newPassword} = req.body;

  if(resetPasswordLink){
    return jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORDS, (err) =>{
      if(err)
      {
        return res.status(400).json({
          error:"the link has expired. Please try again.",
        });
      }

      user.findOne({resetPasswordLink}).exec((err, user)=>{
        if(err || !user){
          return res.status(400).json({
            error:"Something went wrong please try agai  later.",
          });
        }

        const updateFields = {
          password : newPassword,
          resetpasswordlink : "",
        };

        user = _.extend(user, updateFields);

        user.save((err)=>{
          if(err){
            return res.status(400).json({
              error:"Error in saving the new password.",
            });
          }

          return res.json({
            message:"Successfully saved the new password.",
          });
        });
      });

    });

  }
  return res.status(400).json({
    error:"Haven't received the reset password link.",
  });
};
