const express = require("express");

const router = express.Router();

const {
    createAuditCycle,
    getAllAuditCycles,
    getAuditCycleById,
    assignAuditor,
    verifyAsset,
    getAuditItems,
    closeAuditCycle
} = require("../controller/auditController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createAuditCycle
);

router.get(
    "/",
    authMiddleware,
    getAllAuditCycles
);

router.get(
    "/:id",
    authMiddleware,
    getAuditCycleById
);

router.put(
    "/:id/assign",
    authMiddleware,
    roleMiddleware("ADMIN"),
    assignAuditor
);

router.post(
    "/verify",
    authMiddleware,
    verifyAsset
);

router.get(
    "/items/:cycleId",
    authMiddleware,
    getAuditItems
);

router.put(
    "/:id/close",
    authMiddleware,
    roleMiddleware("ADMIN"),
    closeAuditCycle
);

module.exports = router;