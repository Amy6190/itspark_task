const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/auth");
const validateAuth = require("../middleware/validateAuth");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register",validateAuth, authController.register);
router.post("/login",validateAuth, authController.login);
router.get("/all", authenticate, userController.getAllUsers);

module.exports = router;
