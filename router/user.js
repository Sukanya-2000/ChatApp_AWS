const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userAuthentication = require("../middleware/auth");

router.get("/", userController.getLoginPage);
router.post("/signUp", userController.postUserSignUp);
router.post("/login", userController.postUserLogin);

module.exports = router;