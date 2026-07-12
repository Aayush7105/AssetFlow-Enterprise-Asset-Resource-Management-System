const express = require("express");

const router = express.Router();

const {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    searchAssets
} = require("../controller/assetController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    createAsset
);


router.get(
    "/search",
    authMiddleware,
    searchAssets
);

router.get(
    "/",
    authMiddleware,
    getAllAssets
);

router.get(
    "/:id",
    authMiddleware,
    getAssetById
);


router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","ASSET_MANAGER"),
    updateAsset
);


router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteAsset
);

module.exports = router;