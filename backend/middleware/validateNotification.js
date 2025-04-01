const { body } = require("express-validator");

const validateNotification = [
    body("senderId").notEmpty().withMessage("Sender ID is required")
        .isInt().withMessage("Sender ID must be an integer"),

    body("receiverId").notEmpty().withMessage("Receiver ID is required")
        .isInt().withMessage("Receiver ID must be an integer"),

    body("message").notEmpty().withMessage("Message cannot be empty")
        .isLength({ max: 255 }).withMessage("Message too long (max 255 characters)")
];

module.exports = validateNotification;
