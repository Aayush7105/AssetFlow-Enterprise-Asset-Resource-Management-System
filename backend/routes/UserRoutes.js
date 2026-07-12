const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, updateUser, deleteUser } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createUser
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "AUDITOR"),
    getAllUsers
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteUser
);
module.exports = router;
