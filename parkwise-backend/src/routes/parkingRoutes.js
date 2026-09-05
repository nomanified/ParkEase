const express = require("express");
const ParkingSpot = require("../models/ParkingSpot");

const router = express.Router();


// =========================
// GET ALL PARKING SPOTS
// =========================

router.get("/", async (req, res) => {
    try {

        const spots = await ParkingSpot.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: spots.length,
            spots
        });

    } catch (error) {

        console.error(
            "Get parking spots error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET AVAILABLE PARKING SPOTS
// =========================

router.get("/available", async (req, res) => {
    try {

        const spots = await ParkingSpot.find({
            status: "Available"
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            count: spots.length,
            spots
        });

    } catch (error) {

        console.error(
            "Get available spots error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// GET SINGLE PARKING SPOT
// =========================

router.get("/:id", async (req, res) => {
    try {

        const spot =
            await ParkingSpot.findById(req.params.id);

        if (!spot) {

            return res.status(404).json({
                message: "Parking spot not found"
            });
        }

        res.json({
            success: true,
            spot
        });

    } catch (error) {

        console.error(
            "Get parking spot error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// CREATE PARKING SPOT
// =========================

router.post("/", async (req, res) => {
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
                message:
                    "Spot number, location, parking type and price are required"
            });
        }


        const existingSpot =
            await ParkingSpot.findOne({
                spotNumber
            });


        if (existingSpot) {

            return res.status(400).json({
                message:
                    "Parking spot already exists"
            });
        }


        const spot =
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
                "Parking spot created successfully",

            spot

        });

    } catch (error) {

        console.error(
            "Create parking spot error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// UPDATE PARKING SPOT
// =========================

router.put("/:id", async (req, res) => {
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


        const spot =
            await ParkingSpot.findById(
                req.params.id
            );


        if (!spot) {

            return res.status(404).json({
                message:
                    "Parking spot not found"
            });
        }


        if (spotNumber !== undefined) {

            const duplicate =
                await ParkingSpot.findOne({

                    spotNumber,

                    _id: {
                        $ne: req.params.id
                    }

                });


            if (duplicate) {

                return res.status(400).json({
                    message:
                        "Another parking spot already uses this spot number"
                });
            }

            spot.spotNumber = spotNumber;
        }


        if (location !== undefined) {
            spot.location = location;
        }


        if (parkingType !== undefined) {
            spot.parkingType = parkingType;
        }


        if (pricePerHour !== undefined) {
            spot.pricePerHour = pricePerHour;
        }


        if (status !== undefined) {
            spot.status = status;
        }


        if (availableTime !== undefined) {
            spot.availableTime = availableTime;
        }


        if (instructions !== undefined) {
            spot.instructions = instructions;
        }


        if (description !== undefined) {
            spot.description = description;
        }


        await spot.save();


        res.json({

            success: true,

            message:
                "Parking spot updated successfully",

            spot

        });

    } catch (error) {

        console.error(
            "Update parking spot error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// CHANGE PARKING STATUS
// =========================

router.patch("/:id/status", async (req, res) => {
    try {

        const { status } = req.body;


        const allowedStatuses = [
            "Available",
            "Occupied",
            "Reserved",
            "Maintenance"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message:
                    "Invalid parking status"
            });
        }


        const spot =
            await ParkingSpot.findByIdAndUpdate(

                req.params.id,

                { status },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!spot) {

            return res.status(404).json({
                message:
                    "Parking spot not found"
            });
        }


        res.json({

            success: true,

            message:
                "Parking status updated successfully",

            spot

        });

    } catch (error) {

        console.error(
            "Update parking status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// DELETE PARKING SPOT
// =========================

router.delete("/:id", async (req, res) => {
    try {

        const spot =
            await ParkingSpot.findByIdAndDelete(
                req.params.id
            );


        if (!spot) {

            return res.status(404).json({
                message:
                    "Parking spot not found"
            });
        }


        res.json({

            success: true,

            message:
                "Parking spot deleted successfully",

            spot

        });

    } catch (error) {

        console.error(
            "Delete parking spot error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;