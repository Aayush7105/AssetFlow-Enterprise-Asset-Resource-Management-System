const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controller/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

router.get(
    "/:id",
    authMiddleware,
    getNotificationById
);

router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);

router.put(
    "/read-all",
    authMiddleware,
    markAllAsRead
);

router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

module.exports = router;