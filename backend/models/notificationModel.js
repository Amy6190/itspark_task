const pool = require("../config/db");

const Notification = {
    async createNotification(senderId, receiverId, message) {
        const result = await pool.query(
            "INSERT INTO notifications (senderId, receiverId, message) VALUES ($1, $2, $3) RETURNING *",
            [senderId, receiverId, message]
        );
        return result.rows[0];
    },

    async getNotificationsByReceiver(receiverId, limit, offset) {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE receiverId = $1 LIMIT $2 OFFSET $3",
            [receiverId, limit, offset]
        );
        return result.rows;
    },

    async markNotificationAsRead(notificationId) {
        await pool.query("UPDATE notifications SET isRead = true WHERE id = $1", [notificationId]);
    },

    async markAllNotificationsAsRead(userId) {
        await pool.query("UPDATE notifications SET isRead = true WHERE receiverId = $1", [userId]);
    },

    async getAllUsers() {
        const result = await pool.query("SELECT id, username FROM users");
        return result.rows;
    }
};

module.exports = Notification;
