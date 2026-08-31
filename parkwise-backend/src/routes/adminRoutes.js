const express = require("express");
const User = require("../models/User");
const ParkingSpot = require("../models/ParkingSpot");
const Booking = require("../models/Booking");

const router = express.Router();


// =========================
// ADMIN DASHBOARD STATS
// =========================

router.get("/stats", async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalParkingSpots =
            await ParkingSpot.countDocuments();

        const availableSpots =
            await ParkingSpot.countDocuments({
                status: "Available"
            });

        const reservedSpots =
            await ParkingSpot.countDocuments({
                status: "Reserved"
            });

        const totalBookings =
            await Booking.countDocuments();

        const confirmedBookings =
            await Booking.countDocuments({
                status: "Confirmed"
            });

        const completedBookings =
            await Booking.countDocuments({
                status: "Completed"
            });

        const cancelledBookings =
            await Booking.countDocuments({
                status: "Cancelled"
            });


        res.json({
            success: true,

            stats: {
                totalUsers,
                totalParkingSpots,
                availableSpots,
                reservedSpots,
                totalBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings
            }
        });

    } catch (error) {

        console.error(
            "Admin stats error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET ALL USERS
// =========================

router.get("/users", async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({
                createdAt: -1
            });

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET ALL PARKING SPOTS
// =========================

router.get("/parking", async (req, res) => {

    try {

        const spots =
            await ParkingSpot.find()
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            count: spots.length,
            spots
        });

    } catch (error) {

        console.error(
            "Get admin parking error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET ALL BOOKINGS
// =========================

router.get("/bookings", async (req, res) => {

    try {

        const bookings =
            await Booking.find()
                .populate("userId", "-password")
                .populate("parkingSpotId")
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(
            "Get admin bookings error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;