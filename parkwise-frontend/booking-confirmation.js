// =========================
// CHECK LOGIN
// =========================

const token = localStorage.getItem("parkEaseToken");

if (!token) {
    window.location.href = "login.html";
}


// =========================
// GET LAST BOOKING
// =========================

const bookingData =
    localStorage.getItem("lastBooking");


// =========================
// LOAD BOOKING
// =========================

function loadBooking() {

    if (!bookingData) {

        document.getElementById("bookingId").textContent =
            "No Booking Found";

        return;
    }


    try {

        const booking =
            JSON.parse(bookingData);


        // =========================
        // BOOKING ID
        // =========================

        document.getElementById("bookingId").textContent =
            booking.bookingId || "N/A";


        // =========================
        // PARKING SPOT
        // =========================

        const parkingSpot =
            booking.parkingSpot ||
            booking.parkingSpotId ||
            "N/A";

        document.getElementById("parkingSpot").textContent =
            typeof parkingSpot === "object"
                ? parkingSpot.spotNumber || "N/A"
                : parkingSpot;


        // =========================
        // LOCATION
        // =========================

        const location =
            booking.location ||
            booking.parkingLocation ||
            "N/A";

        document.getElementById("location").textContent =
            typeof location === "object"
                ? location.location || "N/A"
                : location;


        // =========================
        // DATE
        // =========================

        document.getElementById("bookingDate").textContent =
            booking.date || "N/A";


        // =========================
        // START TIME
        // =========================

        document.getElementById("startTime").textContent =
            booking.startTime || "N/A";


        // =========================
        // DURATION
        // =========================

        document.getElementById("duration").textContent =
            `${booking.duration || 0} hour(s)`;


        // =========================
        // TOTAL PRICE
        // =========================

        document.getElementById("totalPrice").textContent =
            `$${booking.totalPrice || 0}`;


        // =========================
        // GENERATE QR CODE
        // =========================

        generateQRCode(booking);


    } catch (error) {

        console.error(
            "Booking data error:",
            error
        );

        document.getElementById("bookingId").textContent =
            "Invalid Booking Data";
    }
}


// =========================
// GENERATE QR CODE
// =========================

function generateQRCode(booking) {

    const qrContainer =
        document.getElementById("qrcode");


    if (!qrContainer) {
        return;
    }


    qrContainer.innerHTML = "";


    const qrData = JSON.stringify({

        bookingId:
            booking.bookingId || "",

        parkingSpot:
            booking.parkingSpot || booking.parkingSpotId || "",

        date:
            booking.date || "",

        startTime:
            booking.startTime || "",

        duration:
            booking.duration || 0,

        totalPrice:
            booking.totalPrice || 0

    });


    new QRCode(
        qrContainer,
        {
            text: qrData,

            width: 150,

            height: 150,

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );
}


// =========================
// START
// =========================

loadBooking();