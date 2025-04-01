const pool = require("../config/db");

const User = {
    createUser: async (username, hashedPassword) => {
        return await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        );
    },

    findUserByUsername: async (username) => {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0]; // Return the first user found
    },

    getAllUsersExcept: async (userId) => {
        return await pool.query("SELECT id, username FROM users WHERE id <> $1", [userId]);
    }
};

module.exports = User;
