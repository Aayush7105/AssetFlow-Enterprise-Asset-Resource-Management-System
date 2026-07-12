const express = require("express");

const router = express.Router();

const {
    createTransferRequest,
    getAllTransferRequests,
    getTransferRequestById,
    approveTransferRequest,
    rejectTransferRequest
} = require("../controllers/transferRequestController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    createTransferRequest
);

router.get(
    "/",
    authMiddleware,
    getAllTransferRequests
);

router.get(
    "/:id",
    authMiddleware,
    getTransferRequestById
);

router.put(
    "/:id/approve",
    authMiddleware,
    roleMiddleware("ADMIN", "ASSET_MANAGER"),
    approveTransferRequest
);
router.put(
    "/:id/reject",
    authMiddleware,
    roleMiddleware("ADMIN", "ASSET_MANAGER"),
    rejectTransferRequest
);

module.exports = router;