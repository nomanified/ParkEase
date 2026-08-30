// =========================
// CHECK LOGIN
// =========================

const token = localStorage.getItem("parkEaseToken");

if (!token) {
    window.location.href = "login.html";
}


// =========================
// GET USER
// =========================

const userData =
    localStorage.getItem("parkEaseUser");

let user = null;

try {
    user = userData
        ? JSON.parse(userData)
        : null;
} catch (error) {
    console.error("User data error:", error);
}


// =========================
// GET SELECTED PARKING SPOT
// =========================

const spotId =
    localStorage.getItem("selectedParkingSpot");


// =========================
// VARIABLES
// =========================

let selectedSpot = null;


// =========================
// ELEMENTS
// =========================

const locationElement =
    document.getElementById("location");

const spotNumberElement =
    document.getElementById("spotNumber");

const parkingTypeElement =
    document.getElementById("parkingType");

const priceElement =
    document.getElementById("pricePerHour");

const dateInput =
    document.getElementById("bookingDate");

const startTimeInput =
    document.getElementById("startTime");

const durationSelect =
    document.getElementById("duration");

const totalPriceElement =
    document.getElementById("totalPrice");

const bookingForm =
    document.getElementById("bookingForm");

const messageElement =
    document.getElementById("message");

const bookButton =
    document.getElementById("bookButton");


// =========================
// SET MINIMUM DATE
// =========================

function setMinimumDate() {

    if (!dateInput) {
        return;
    }

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}

setMinimumDate();


// =========================
// LOAD PARKING SPOT
// =========================

async function loadParkingSpot() {

    if (!spotId) {

        showMessage(
            "Please select a parking spot first.",
            "error"
        );

        if (locationElement) {
            locationElement.textContent =
                "No Spot Selected";
        }

        if (spotNumberElement) {
            spotNumberElement.textContent =
                "Please return to Dashboard.";
        }

        if (bookButton) {
            bookButton.disabled = true;
        }

        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/parking/${spotId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load parking spot"
            );
        }


        selectedSpot =
            data.spot;


        // =========================
        // CHECK AVAILABILITY
        // =========================

        if (
            selectedSpot.status !==
            "Available"
        ) {

            showMessage(
                "This parking spot is currently not available.",
                "error"
            );

            if (bookButton) {
                bookButton.disabled = true;
            }
        }


        // =========================
        // DISPLAY SPOT
        // =========================

        if (locationElement) {
            locationElement.textContent =
                selectedSpot.location || "N/A";
        }


        if (spotNumberElement) {
            spotNumberElement.textContent =
                selectedSpot.spotNumber || "N/A";
        }


        if (parkingTypeElement) {
            parkingTypeElement.textContent =
                selectedSpot.parkingType || "N/A";
        }


        if (priceElement) {
            priceElement.textContent =
                `$${selectedSpot.pricePerHour || 0} / hour`;
        }


        calculateTotalPrice();


    } catch (error) {

        console.error(
            "Parking spot loading error:",
            error
        );


        showMessage(
            "Unable to load parking information. Please make sure the backend server is running.",
            "error"
        );


        if (bookButton) {
            bookButton.disabled = true;
        }
    }
}


// =========================
// CALCULATE TOTAL PRICE
// =========================

function calculateTotalPrice() {

    if (
        !selectedSpot ||
        !durationSelect ||
        !totalPriceElement
    ) {
        return;
    }


    const duration =
        Number(durationSelect.value);


    const pricePerHour =
        Number(
            selectedSpot.pricePerHour
        );


    if (
        !duration ||
        !pricePerHour
    ) {

        totalPriceElement.textContent =
            "$0";

        return;
    }


    const totalPrice =
        duration *
        pricePerHour;


    totalPriceElement.textContent =
        `$${totalPrice.toFixed(2)}`;
}


// =========================
// DURATION CHANGE
// =========================

if (durationSelect) {

    durationSelect.addEventListener(
        "change",
        calculateTotalPrice
    );
}


// =========================
// MESSAGE
// =========================

function showMessage(
    message,
    type
) {

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    if (type === "error") {

        messageElement.style.color =
            "#fca5a5";

    } else {

        messageElement.style.color =
            "#67e8f9";
    }
}


// =========================
// CREATE BOOKING
// =========================

async function createBooking(event) {

    event.preventDefault();


    // =========================
    // CHECK USER
    // =========================

    if (!user || !user._id) {

        showMessage(
            "User information not found. Please login again.",
            "error"
        );

        return;
    }


    // =========================
    // CHECK SPOT
    // =========================

    if (!selectedSpot) {

        showMessage(
            "Parking spot information is not available.",
            "error"
        );

        return;
    }


    // =========================
    // GET FORM DATA
    // =========================

    const date =
        dateInput.value;

    const startTime =
        startTimeInput.value;

    const duration =
        Number(durationSelect.value);


    // =========================
    // VALIDATION
    // =========================

    if (
        !date ||
        !startTime ||
        !duration
    ) {

        showMessage(
            "Please select date, start time and duration.",
            "error"
        );

        return;
    }


    // =========================
    // TOTAL PRICE
    // =========================

    const totalPrice =
        Number(
            selectedSpot.pricePerHour
        ) * duration;


    // =========================
    // DISABLE BUTTON
    // =========================

    bookButton.disabled = true;

    bookButton.textContent =
        "Booking...";


    showMessage(
        "Creating your booking...",
        "success"
    );


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        userId:
                            user._id,

                        parkingSpotId:
                            selectedSpot._id,

                        date:
                            date,

                        startTime:
                            startTime,

                        duration:
                            duration
                    })
                }
            );


        const data =
            await response.json();


        // =========================
        // CHECK RESPONSE
        // =========================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Booking failed"
            );
        }


        // =========================
        // BOOKING SUCCESS
        // =========================

        const booking =
            data.booking;


        // Save booking for
        // confirmation page

        const confirmationData = {

            bookingId:
                booking.bookingId,

            parkingSpot:
                selectedSpot.spotNumber,

            location:
                selectedSpot.location,

            date:
                booking.date,

            startTime:
                booking.startTime,

            duration:
                booking.duration,

            totalPrice:
                booking.totalPrice
        };


        localStorage.setItem(
            "lastBooking",
            JSON.stringify(
                confirmationData
            )
        );


        // =========================
        // GO TO CONFIRMATION
        // =========================

        window.location.href =
            "booking-confirmation.html";


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to create booking.",
            "error"
        );


        bookButton.disabled =
            false;

        bookButton.textContent =
            "Confirm Booking";
    }
}


// =========================
// FORM SUBMIT
// =========================

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        createBooking
    );
}


// =========================
// START
// =========================

loadParkingSpot();