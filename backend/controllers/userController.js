const User = require("../models/userModel");

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const result = await User.getAllUsersExcept(req.user.id);
            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

module.exports = userController;
