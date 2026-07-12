const express = require("express");
const router = express.Router();
const {createUser} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createUser
);
module.exports = router;