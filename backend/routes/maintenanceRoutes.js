const express = require("express");

const router = express.Router();

const {
    raiseMaintenanceRequest,
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    approveMaintenanceRequest,
    rejectMaintenanceRequest,
    assignTechnician,
    startMaintenance,
    resolveMaintenance
} = require("../controller/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    raiseMaintenanceRequest
);

router.get(
    "/",
    authMiddleware,
    getAllMaintenanceRequests
);

router.get(
    "/:id",
    authMiddleware,
    getMaintenanceRequestById
);

router.put(
    "/:id/approve",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    approveMaintenanceRequest
);

router.put(
    "/:id/reject",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    rejectMaintenanceRequest
);

router.put(
    "/:id/assign",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    assignTechnician
);

router.put(
    "/:id/start",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    startMaintenance
);

router.put(
    "/:id/resolve",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    resolveMaintenance
);

module.exports = router;