const express = require("express");

const router = express.Router();

const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    completeBooking
} = require("../controllers/resourceBookingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    createBooking
);

router.get(
    "/",
    authMiddleware,
    getAllBookings
);

router.get(
    "/:id",
    authMiddleware,
    getBookingById
);

router.put(
    "/:id",
    authMiddleware,
    updateBooking
);

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);

router.put(
    "/:id/complete",
    authMiddleware,
    completeBooking
);

module.exports = router;