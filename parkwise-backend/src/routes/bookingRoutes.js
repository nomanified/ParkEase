const express = require("express");
const Booking = require("../models/Booking");
const ParkingSpot = require("../models/ParkingSpot");

const router = express.Router();


// =========================
// CREATE BOOKING
// =========================

router.post("/", async (req, res) => {
    try {

        const {
            userId,
            parkingSpotId,
            date,
            startTime,
            duration
        } = req.body;


        // Check required fields
        if (
            !userId ||
            !parkingSpotId ||
            !date ||
            !startTime ||
            !duration
        ) {
            return res.status(400).json({
                message: "All booking fields are required"
            });
        }


        // Find parking spot
        const parkingSpot =
            await ParkingSpot.findById(parkingSpotId);


        if (!parkingSpot) {
            return res.status(404).json({
                message: "Parking spot not found"
            });
        }


        // Check availability
        if (parkingSpot.status !== "Available") {
            return res.status(400).json({
                message: "Parking spot is not available"
            });
        }


        // Calculate total price
        const totalPrice =
            Number(parkingSpot.pricePerHour) *
            Number(duration);


        // Generate unique booking ID
        const bookingId =
            "PK-" +
            Date.now() +
            "-" +
            Math.floor(
                1000 + Math.random() * 9000
            );


        // Create booking
        const booking =
            await Booking.create({

                userId,

                parkingSpotId,

                date,

                startTime,

                duration,

                totalPrice,

                bookingId,

                status: "Confirmed"

            });


        // Change parking status
        parkingSpot.status = "Reserved";

        await parkingSpot.save();


        res.status(201).json({

            success: true,

            message: "Booking created successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Create booking error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }
});


// =========================
// GET USER BOOKINGS
// =========================

router.get("/user/:userId", async (req, res) => {

    try {

        const bookings =
            await Booking.find({
                userId: req.params.userId
            })
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
            "Get user bookings error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =========================
// GET SINGLE BOOKING
// =========================

router.get("/:id", async (req, res) => {

    try {

        const booking =
            await Booking.findById(
                req.params.id
            )
            .populate("parkingSpotId");


        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        res.json({

            success: true,

            booking

        });


    } catch (error) {

        console.error(
            "Get booking error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =========================
// CANCEL BOOKING
// =========================

router.put("/:id/cancel", async (req, res) => {

    try {

        const booking =
            await Booking.findById(
                req.params.id
            );


        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        if (booking.status === "Cancelled") {

            return res.status(400).json({
                message: "Booking is already cancelled"
            });

        }


        booking.status = "Cancelled";

        await booking.save();


        // Make parking spot available again
        const parkingSpot =
            await ParkingSpot.findById(
                booking.parkingSpotId
            );


        if (parkingSpot) {

            parkingSpot.status = "Available";

            await parkingSpot.save();

        }


        res.json({

            success: true,

            message: "Booking cancelled successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;