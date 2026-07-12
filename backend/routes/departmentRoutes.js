const express = require("express");

const router = express.Router();

const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    assignDepartmentHead
} = require("../controller/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createDepartment
);
router.get(
    "/",
    authMiddleware,
    getAllDepartments
);

router.get(
    "/:id",
    authMiddleware,
    getDepartmentById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateDepartment
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteDepartment
);

router.patch(
    "/:id/head",
    authMiddleware,
    roleMiddleware("ADMIN"),
    assignDepartmentHead
);

module.exports = router;