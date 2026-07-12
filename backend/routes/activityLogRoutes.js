const express = require("express");

const router = express.Router();

const {
    getAllActivityLogs,
    getActivityLogById
} = require("../controller/activityLogController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    getAllActivityLogs
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    getActivityLogById
);

module.exports = router;