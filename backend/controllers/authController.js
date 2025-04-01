const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authController = {
    register: async (req, res) => {
        const { username, password } = req.body;

        try {
            const existingUser = await User.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists, choose a different one" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.createUser(username, hashedPassword);
            res.status(201).json({ message: "User registered", user: result.rows[0] });
        } catch (err) {
            res.status(400).json({ error: "Username already exists" });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findUserByUsername(username);

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token , id:user.id});
    }
};

module.exports = authController;
