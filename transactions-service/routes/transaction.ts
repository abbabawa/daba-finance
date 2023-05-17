import express from "express";
const router = express.Router();

//import controllers
const { makeTransfer, transactionHistory, getAccountBalance } = require("../controllers/transaction");

//routes
router.route("/transfer-funds").post(makeTransfer);
router.route("/view/:userId").get(transactionHistory);
router.route("/account-balance/:userId").get(getAccountBalance);

module.exports = router;
