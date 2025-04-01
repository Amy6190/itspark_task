const { body } = require("express-validator");

const validateAuth = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

module.exports = validateAuth;
