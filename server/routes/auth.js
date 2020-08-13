const express = require("express");
const router = express.Router();
const {signup, activateAccount, signin, forgotPassword, resetPassword} = require("../controller/auth");

// console.log("helo");

router.post("/signup", signup);

router.post("/account-activation", activateAccount);

router.post("/signin", signin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
