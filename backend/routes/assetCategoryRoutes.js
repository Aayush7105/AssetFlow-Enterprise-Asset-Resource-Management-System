const express = require("express");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controller/assetCategoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createCategory
);

router.get(
    "/",
    authMiddleware,
    getAllCategories
);

router.get(
    "/:id",
    authMiddleware,
    getCategoryById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteCategory
);

module.exports = router;