const { validationResult } = require("express-validator");
const Notification = require("../models/notificationModel");
const socketManager = require("../config/socketManager");

const notificationController = {
    sendNotification: async (req, res) => {
        console.log(req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {senderId,  receiverId, message } = req.body;
        try {
            const notification = await Notification.createNotification(senderId, receiverId, message);

            const io = socketManager.getIO();
            io.to(`user_${receiverId}`).emit("new_notification", notification);

            res.json({ message: "Notification sent", notification });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error sending notification" });
        }
    },

    getNotifications: async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        try {
            const notifications = await Notification.getNotificationsByReceiver(req.user.id, limit, offset);
            res.json(notifications);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching notifications" });
        }
    },

    markAsRead: async (req, res) => {
        try {
            await Notification.markNotificationAsRead(req.params.id);
            res.json({ message: "Notification marked as read" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating notification status" });
        }
    },

    markAllAsRead: async (req, res) => {
        const { userId } = req.params;

        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        try {
            await Notification.markAllNotificationsAsRead(userId);
            res.json({ message: "All notifications marked as read for the user" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating notifications" });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await Notification.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

module.exports = notificationController;
