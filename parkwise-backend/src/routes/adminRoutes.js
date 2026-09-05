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

        const occupiedSpots =
            await ParkingSpot.countDocuments({
                status: "Occupied"
            });

        const maintenanceSpots =
            await ParkingSpot.countDocuments({
                status: "Maintenance"
            });

        const totalBookings =
            await Booking.countDocuments();

        const confirmedBookings =
            await Booking.countDocuments({
                status: "Confirmed"
            });

        const activeBookings =
            await Booking.countDocuments({
                status: "Active"
            });

        const completedBookings =
            await Booking.countDocuments({
                status: "Completed"
            });

        const cancelledBookings =
            await Booking.countDocuments({
                status: "Cancelled"
            });

        const revenueResult =
            await Booking.aggregate([
                {
                    $match: {
                        status: {
                            $ne: "Cancelled"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalPrice"
                        }
                    }
                }
            ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        res.json({
            success: true,

            stats: {
                totalUsers,
                totalParkingSpots,
                availableSpots,
                reservedSpots,
                occupiedSpots,
                maintenanceSpots,
                totalBookings,
                confirmedBookings,
                activeBookings,
                completedBookings,
                cancelledBookings,
                totalRevenue
            }
        });

    } catch (error) {

        console.error(
            "Admin stats error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// GET ALL USERS
// =========================

router.get("/users", async (req, res) => {
    try {

        const users =
            await User.find()
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
            success: false,
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
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// ADD PARKING SPOT
// =========================

router.post("/parking", async (req, res) => {
    try {

        const {
            spotNumber,
            location,
            parkingType,
            pricePerHour,
            status,
            availableTime,
            instructions,
            description
        } = req.body;


        if (
            !spotNumber ||
            !location ||
            !parkingType ||
            pricePerHour === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Required parking fields are missing"
            });
        }


        const existingSpot =
            await ParkingSpot.findOne({
                spotNumber
            });


        if (existingSpot) {

            return res.status(400).json({
                success: false,
                message:
                    "Parking spot number already exists"
            });
        }


        const parkingSpot =
            await ParkingSpot.create({

                spotNumber,

                location,

                parkingType,

                pricePerHour,

                status:
                    status || "Available",

                availableTime:
                    availableTime || "24 Hours",

                instructions:
                    instructions || "",

                description:
                    description || ""

            });


        res.status(201).json({

            success: true,

            message:
                "Parking spot added successfully",

            spot: parkingSpot
        });

    } catch (error) {

        console.error(
            "Add parking error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// UPDATE PARKING SPOT
// =========================

router.put("/parking/:id", async (req, res) => {
    try {

        const parkingSpot =
            await ParkingSpot.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );


        if (!parkingSpot) {

            return res.status(404).json({
                success: false,
                message:
                    "Parking spot not found"
            });
        }


        res.json({

            success: true,

            message:
                "Parking spot updated successfully",

            spot: parkingSpot
        });

    } catch (error) {

        console.error(
            "Update parking error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// DELETE PARKING SPOT
// =========================

router.delete("/parking/:id", async (req, res) => {
    try {

        const parkingSpot =
            await ParkingSpot.findByIdAndDelete(
                req.params.id
            );


        if (!parkingSpot) {

            return res.status(404).json({
                success: false,
                message:
                    "Parking spot not found"
            });
        }


        res.json({

            success: true,

            message:
                "Parking spot deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete parking error:",
            error
        );

        res.status(500).json({
            success: false,
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

                .populate(
                    "userId",
                    "-password"
                )

                .populate(
                    "parkingSpotId"
                )

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
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// UPDATE BOOKING STATUS
// =========================

router.put(
    "/bookings/:id/status",
    async (req, res) => {

        try {

            const { status } = req.body;


            const allowedStatuses = [
                "Confirmed",
                "Active",
                "Completed",
                "Cancelled"
            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid booking status"
                });
            }


            const booking =
                await Booking.findByIdAndUpdate(

                    req.params.id,

                    {
                        status
                    },

                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found"
                });
            }


            res.json({

                success: true,

                message:
                    "Booking status updated successfully",

                booking
            });

        } catch (error) {

            console.error(
                "Update booking status error:",
                error
            );

            res.status(500).json({

                success: false,

                message: "Server error"
            });
        }
    }
);


// =========================
// DELETE USER
// =========================

router.delete("/users/:id", async (req, res) => {
    try {

        const user =
            await User.findByIdAndDelete(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"
            });
        }


        res.json({

            success: true,

            message:
                "User deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
});


// =========================
// EXPORT ROUTER
// =========================

module.exports = router;