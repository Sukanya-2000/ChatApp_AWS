const express = require("express");
const router = express.Router();
const homePageController = require("../controllers/homePage");
const userAuthentication = require("../middleware/auth");

router.get("/", homePageController.getHomePage);

module.exports = router;