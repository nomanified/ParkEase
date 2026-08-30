// =========================
// CHECK LOGIN
// =========================

const token =
    localStorage.getItem("parkEaseToken");

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

    console.error(
        "User data error:",
        error
    );

}


// =========================
// GET SELECTED PARKING SPOT
// =========================

const spotId =
    localStorage.getItem(
        "selectedParkingSpot"
    );


// =========================
// VARIABLES
// =========================

let parkingSpot = null;


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
    document.getElementById("price");

const bookingDate =
    document.getElementById("bookingDate");

const startTime =
    document.getElementById("startTime");

const duration =
    document.getElementById("duration");

const totalPrice =
    document.getElementById("totalPrice");

const bookingForm =
    document.getElementById("bookingForm");

const message =
    document.getElementById("message");

const bookButton =
    document.getElementById("bookButton");


// =========================
// SET MINIMUM DATE
// =========================

function setMinimumDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;

    bookingDate.min =
        todayString;

}


// =========================
// LOAD PARKING DETAILS
// =========================

async function loadParkingDetails() {

    if (!spotId) {

        showMessage(
            "No parking spot selected. Please return to Dashboard.",
            true
        );

        locationElement.textContent =
            "Not Selected";

        spotNumberElement.textContent =
            "N/A";

        parkingTypeElement.textContent =
            "N/A";

        priceElement.textContent =
            "$0";

        bookButton.disabled = true;

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


        parkingSpot =
            data.spot;


        // =========================
        // DISPLAY SPOT
        // =========================

        locationElement.textContent =
            parkingSpot.location ||
            "N/A";


        spotNumberElement.textContent =
            parkingSpot.spotNumber ||
            "N/A";


        parkingTypeElement.textContent =
            parkingSpot.parkingType ||
            parkingSpot.type ||
            "N/A";


        const price =
            Number(
                parkingSpot.pricePerHour ||
                parkingSpot.price ||
                0
            );


        priceElement.textContent =
            `$${price} / hour`;


        // =========================
        // CHECK STATUS
        // =========================

        if (
            parkingSpot.status &&
            parkingSpot.status !== "Available"
        ) {

            showMessage(
                `This parking spot is currently ${parkingSpot.status}.`,
                true
            );

            bookButton.disabled =
                true;

        }


    } catch (error) {

        console.error(
            "Parking details error:",
            error
        );


        showMessage(
            "Unable to load parking spot. Please make sure the backend server is running.",
            true
        );


        bookButton.disabled =
            true;

    }

}


// =========================
// CALCULATE TOTAL
// =========================

function calculateTotal() {

    if (!parkingSpot) {

        totalPrice.textContent =
            "$0";

        return;
    }


    const price =
        Number(
            parkingSpot.pricePerHour ||
            parkingSpot.price ||
            0
        );


    const hours =
        Number(
            duration.value
        );


    const total =
        price * hours;


    totalPrice.textContent =
        `$${total.toFixed(2)}`;

}


// =========================
// SHOW MESSAGE
// =========================

function showMessage(
    text,
    isError = false
) {

    message.textContent =
        text;


    if (isError) {

        message.style.color =
            "#fca5a5";

    } else {

        message.style.color =
            "#67e8f9";

    }

}


// =========================
// VALIDATE USER
// =========================

function getUserId() {

    if (!user) {
        return null;
    }


    return (
        user._id ||
        user.id ||
        user.userId ||
        null
    );

}


// =========================
// BOOK PARKING
// =========================

async function createBooking(event) {

    event.preventDefault();


    showMessage("");


    // =========================
    // CHECK USER
    // =========================

    const userId =
        getUserId();


    if (!userId) {

        showMessage(
            "User information not found. Please login again.",
            true
        );

        return;
    }


    // =========================
    // CHECK SPOT
    // =========================

    if (!spotId) {

        showMessage(
            "Please select a parking spot first.",
            true
        );

        return;
    }


    // =========================
    // GET FORM VALUES
    // =========================

    const date =
        bookingDate.value;

    const time =
        startTime.value;

    const hours =
        Number(
            duration.value
        );


    // =========================
    // VALIDATION
    // =========================

    if (
        !date ||
        !time ||
        !hours
    ) {

        showMessage(
            "Please select date, start time and duration.",
            true
        );

        return;
    }


    if (
        parkingSpot &&
        parkingSpot.status !== "Available"
    ) {

        showMessage(
            "This parking spot is no longer available.",
            true
        );

        return;
    }


    // =========================
    // DISABLE BUTTON
    // =========================

    bookButton.disabled =
        true;

    bookButton.textContent =
        "Creating Booking...";


    try {

        // =========================
        // CREATE BOOKING
        // =========================

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
                            userId,

                        parkingSpotId:
                            spotId,

                        date:
                            date,

                        startTime:
                            time,

                        duration:
                            hours

                    })
                }
            );


        const data =
            await response.json();


        // =========================
        // ERROR
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


        // Add parking information
        // for confirmation page

        const bookingForStorage = {

            ...booking,

            parkingSpot:
                parkingSpot.spotNumber,

            location:
                parkingSpot.location

        };


        // Save last booking

        localStorage.setItem(
            "lastBooking",
            JSON.stringify(
                bookingForStorage
            )
        );


        // Save booking ID

        localStorage.setItem(
            "lastBookingId",
            booking._id
        );


        // Go to confirmation

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
            true
        );


        bookButton.disabled =
            false;

        bookButton.textContent =
            "Confirm Booking";

    }

}


// =========================
// EVENTS
// =========================

duration.addEventListener(
    "change",
    calculateTotal
);


bookingForm.addEventListener(
    "submit",
    createBooking
);


// =========================
// START
// =========================

setMinimumDate();

loadParkingDetails();