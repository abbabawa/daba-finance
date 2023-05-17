import express from "express";
const router = express.Router();

//import controllers
const { makeTransfer, transactionHistory } = require("../controllers/transaction");

//routes
router.route("/transfer-funds").post(makeTransfer);
router.route("/view/:userId").get(transactionHistory);

module.exports = router;
