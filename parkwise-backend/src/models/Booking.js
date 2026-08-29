const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        parkingSpotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParkingSpot",
            required: true
        },

        date: {
            type: String,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },

        bookingId: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: [
                "Confirmed",
                "Active",
                "Completed",
                "Cancelled"
            ],
            default: "Confirmed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);