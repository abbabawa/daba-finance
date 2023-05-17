import express from "express";
const router = express.Router();

//import controllers
const { register, login, getUserByEmail, verifyToken } = require("../controllers/auth");

//routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user/:email").get(getUserByEmail);
router.route("/verify-token").post(verifyToken);

module.exports = router;
