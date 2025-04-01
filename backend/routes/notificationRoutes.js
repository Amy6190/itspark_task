const express = require("express");
const authenticate = require("../middleware/auth");
const validateNotification = require("../middleware/validateNotification");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.post("/send", authenticate, validateNotification, notificationController.sendNotification);
router.get("/", authenticate, notificationController.getNotifications);
router.put("/:id/read", authenticate, notificationController.markAsRead);
router.put("/user/:userId/read", authenticate, notificationController.markAllAsRead);
router.get("/all", authenticate, notificationController.getAllUsers);

module.exports = router;
