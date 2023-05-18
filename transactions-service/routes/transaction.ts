import express from "express";
const router = express.Router();

//import controllers
const { makeTransfer, transactionHistory, getAccountBalance } = require("../controllers/transaction");

//routes
router.route("/transfer-funds").post(makeTransfer);
router.route("/view").get(transactionHistory);
router.route("/account-balance").get(getAccountBalance);

module.exports = router;
