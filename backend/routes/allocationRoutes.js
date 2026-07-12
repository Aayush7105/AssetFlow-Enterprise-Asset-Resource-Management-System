const express = require("express");

const router = express.Router();

const {
    allocateAsset,
    getAllAllocations,
    getAllocationById,
    returnAsset,
    getAssetAllocationHistory
} = require("../controller/allocationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "ASSET_MANAGER"),
    allocateAsset
);

router.get(
    "/",
    authMiddleware,
    getAllAllocations
);

router.get(
    "/:id",
    authMiddleware,
    getAllocationById
);

router.put(
    "/:id/return",
    authMiddleware,
    roleMiddleware("ADMIN", "ASSET_MANAGER"),
    returnAsset
);

router.get(
    "/history/:assetId",
    authMiddleware,
    getAssetAllocationHistory
);

module.exports = router;