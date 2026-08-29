// =========================
// CHECK LOGIN
// =========================

const token = localStorage.getItem("parkEaseToken");

if (!token) {
    window.location.href = "login.html";
}


// =========================
// GET USER DATA
// =========================

const userData = localStorage.getItem("parkEaseUser");

let user = null;

if (userData) {
    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error("User data error:", error);
    }
}


// =========================
// GET SELECTED PARKING SPOT
// =========================

const spotId =
    localStorage.getItem("selectedParkingSpot");


// =========================
// CURRENT PARKING SPOT
// =========================

let currentSpot = null;


// =========================
// LOAD PARKING DETAILS
// =========================

async function loadParkingDetails() {

    if (!spotId) {

        document.getElementById("location").textContent =
            "Parking Not Selected";

        document.getElementById("spotNumber").textContent =
            "Please select a parking spot from Dashboard.";

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/parking/${spotId}`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load parking details"
            );

        }


        currentSpot = data.spot;


        // =========================
        // DISPLAY PARKING DETAILS
        // =========================

        document.getElementById("location").textContent =
            currentSpot.location || "N/A";


        document.getElementById("location2").textContent =
            currentSpot.location || "N/A";


        document.getElementById("spotNumber").textContent =
            `Spot: ${currentSpot.spotNumber || "N/A"}`;


        document.getElementById("status").textContent =
            currentSpot.status || "N/A";


        document.getElementById("parkingType").textContent =
            currentSpot.parkingType || "N/A";


        document.getElementById("price").textContent =
            `$${currentSpot.pricePerHour || 0} / hour`;


        document.getElementById("availableTime").textContent =
            currentSpot.availableTime || "24 Hours";


        document.getElementById("instructions").textContent =
            currentSpot.instructions ||
            "No special instructions provided.";


        document.getElementById("description").textContent =
            currentSpot.description ||
            "No description available.";


        // Calculate price
        calculateTotalPrice();


    } catch (error) {

        console.error(
            "Parking details error:",
            error
        );


        document.getElementById("location").textContent =
            "Unable to Load";


        document.getElementById("spotNumber").textContent =
            "Please make sure the backend server is running.";

    }
}


// =========================
// SET TODAY AS MINIMUM DATE
// =========================

const bookingDate =
    document.getElementById("bookingDate");


if (bookingDate) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    bookingDate.min = today;

    bookingDate.value = today;
}


// =========================
// CALCULATE TOTAL PRICE
// =========================

function calculateTotalPrice() {

    if (!currentSpot) {
        return;
    }


    const durationElement =
        document.getElementById("duration");


    const totalPriceElement =
        document.getElementById("totalPrice");


    if (!durationElement || !totalPriceElement) {
        return;
    }


    const duration =
        Number(durationElement.value);


    const pricePerHour =
        Number(currentSpot.pricePerHour);


    const totalPrice =
        pricePerHour * duration;


    totalPriceElement.textContent =
        `$${totalPrice}`;
}


// =========================
// DURATION CHANGE
// =========================

const durationSelect =
    document.getElementById("duration");


if (durationSelect) {

    durationSelect.addEventListener(
        "change",
        calculateTotalPrice
    );

}


// =========================
// BOOK PARKING SPOT
// =========================

async function bookParkingSpot() {

    const bookingDateElement =
        document.getElementById("bookingDate");


    const startTimeElement =
        document.getElementById("startTime");


    const durationElement =
        document.getElementById("duration");


    const messageElement =
        document.getElementById("bookingMessage");


    if (
        !bookingDateElement ||
        !startTimeElement ||
        !durationElement ||
        !messageElement
    ) {

        console.error(
            "Booking form elements not found."
        );

        return;
    }


    const date =
        bookingDateElement.value;


    const startTime =
        startTimeElement.value;


    const duration =
        Number(durationElement.value);


    // =========================
    // VALIDATION
    // =========================

    if (!date) {

        messageElement.textContent =
            "Please select a date.";

        return;
    }


    if (!startTime) {

        messageElement.textContent =
            "Please select a start time.";

        return;
    }


    if (!duration) {

        messageElement.textContent =
            "Please select parking duration.";

        return;
    }


    if (!user || !user._id) {

        messageElement.textContent =
            "User information not found. Please login again.";

        return;
    }


    if (!currentSpot) {

        messageElement.textContent =
            "Parking spot information is not loaded.";

        return;
    }


    if (currentSpot.status !== "Available") {

        messageElement.textContent =
            "This parking spot is not available.";

        return;
    }


    // =========================
    // CALCULATE TOTAL
    // =========================

    const totalPrice =
        Number(currentSpot.pricePerHour) *
        duration;


    try {

        messageElement.textContent =
            "Creating your booking...";


        // =========================
        // SEND BOOKING TO BACKEND
        // =========================

        const response =
            await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            user._id,

                        parkingSpotId:
                            currentSpot._id,

                        date:
                            date,

                        startTime:
                            startTime,

                        duration:
                            duration,

                        totalPrice:
                            totalPrice

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Booking failed"
            );

        }


        // =========================
        // SAVE BOOKING
        // =========================

        localStorage.setItem(
            "lastBooking",
            JSON.stringify(data.booking)
        );


        // =========================
        // SUCCESS
        // =========================

        messageElement.textContent =
            "Booking successful!";


        alert(
            `Booking Confirmed!\n\nBooking ID: ${data.booking.bookingId}`
        );


        // =========================
        // OPEN CONFIRMATION PAGE
        // =========================

        window.location.href =
            "booking-confirmation.html";


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        messageElement.textContent =
            error.message ||
            "Unable to create booking.";

    }

}


// =========================
// BOOK BUTTON
// =========================

const bookNowButton =
    document.getElementById("bookNowButton");


if (bookNowButton) {

    bookNowButton.addEventListener(
        "click",
        bookParkingSpot
    );

}


// =========================
// START
// =========================

loadParkingDetails();