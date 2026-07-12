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


router.post(
"/",
    createDepartment
);


module.exports = router;