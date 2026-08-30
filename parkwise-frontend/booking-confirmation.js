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

        document.getElementById("parkingSpot").textContent =
            "N/A";

        document.getElementById("location").textContent =
            "N/A";

        document.getElementById("bookingDate").textContent =
            "N/A";

        document.getElementById("startTime").textContent =
            "N/A";

        document.getElementById("duration").textContent =
            "N/A";

        document.getElementById("totalPrice").textContent =
            "$0.00";

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
            (
                typeof booking.parkingSpotId === "object"
                    ? booking.parkingSpotId.location
                    : ""
            ) ||
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
            `$${Number(
                booking.totalPrice || 0
            ).toFixed(2)}`;


        // =========================
        // GENERATE QR
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


    // =========================
    // QR DATA
    // =========================

    const parkingSpot =
        booking.parkingSpot ||
        booking.parkingSpotId ||
        "";


    const location =
        booking.location ||
        booking.parkingLocation ||
        "";


    const qrData = JSON.stringify({

        bookingId:
            booking.bookingId || "",

        parkingSpot:
            typeof parkingSpot === "object"
                ? parkingSpot.spotNumber || ""
                : parkingSpot,

        location:
            typeof location === "object"
                ? location.location || ""
                : location,

        date:
            booking.date || "",

        startTime:
            booking.startTime || "",

        duration:
            booking.duration || 0,

        totalPrice:
            booking.totalPrice || 0

    });


    // =========================
    // CREATE QR
    // =========================

    if (typeof QRCode === "undefined") {

        qrContainer.innerHTML = `
            <p style="
                color: #555;
                font-size: 13px;
            ">
                QR Code library could not be loaded.
            </p>
        `;

        return;
    }


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