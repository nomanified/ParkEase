const mongoose = require("mongoose");

const parkingSpotSchema = new mongoose.Schema(
    {
        spotNumber: {
            type: String,
            required: true,
            unique: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        parkingType: {
            type: String,
            enum: ["Indoor", "Outdoor", "Basement"],
            required: true
        },

        pricePerHour: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Available", "Occupied", "Reserved", "Maintenance"],
            default: "Available"
        },

        availableTime: {
            type: String,
            default: "24 Hours"
        },

        instructions: {
            type: String,
            default: "Please park your vehicle inside the marked area."
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ParkingSpot", parkingSpotSchema);