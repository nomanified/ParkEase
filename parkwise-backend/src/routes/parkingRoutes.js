const express = require("express");
const ParkingSpot = require("../models/ParkingSpot");

const router = express.Router();


// GET ALL PARKING SPOTS
router.get("/", async (req, res) => {
    try {
        const spots = await ParkingSpot.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            count: spots.length,
            spots
        });

    } catch (error) {
        console.error("Get parking spots error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET AVAILABLE PARKING SPOTS
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
        console.error("Get available spots error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET SINGLE PARKING SPOT
router.get("/:id", async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);

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
        console.error("Get parking spot error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// CREATE PARKING SPOT
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
                message: "Spot number, location, parking type and price are required"
            });
        }

        const existingSpot = await ParkingSpot.findOne({
            spotNumber
        });

        if (existingSpot) {
            return res.status(400).json({
                message: "Parking spot already exists"
            });
        }

        const spot = await ParkingSpot.create({
            spotNumber,
            location,
            parkingType,
            pricePerHour,
            status,
            availableTime,
            instructions,
            description
        });

        res.status(201).json({
            message: "Parking spot created successfully",
            spot
        });

    } catch (error) {
        console.error("Create parking spot error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;