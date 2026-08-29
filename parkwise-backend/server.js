const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const parkingRoutes = require("./src/routes/parkingRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());


/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/bookings", bookingRoutes);


/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ParkEase Backend is running!"
    });
});


/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {

        console.log("MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error.message
        );

    });