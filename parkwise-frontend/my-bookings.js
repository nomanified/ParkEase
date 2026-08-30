// =========================
// CHECK LOGIN
// =========================

const token =
    localStorage.getItem("parkEaseToken");

const userData =
    localStorage.getItem("parkEaseUser");

if (!token) {
    window.location.href = "login.html";
}


// =========================
// GET USER
// =========================

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


if (!user || !user._id) {

    alert(
        "User information not found. Please login again."
    );

    localStorage.removeItem(
        "parkEaseToken"
    );

    localStorage.removeItem(
        "parkEaseUser"
    );

    window.location.href =
        "login.html";
}


// =========================
// ELEMENTS
// =========================

const bookingsList =
    document.getElementById(
        "bookingsList"
    );

const totalBookings =
    document.getElementById(
        "totalBookings"
    );

const confirmedBookings =
    document.getElementById(
        "confirmedBookings"
    );

const completedBookings =
    document.getElementById(
        "completedBookings"
    );

const cancelledBookings =
    document.getElementById(
        "cancelledBookings"
    );

const messageElement =
    document.getElementById(
        "message"
    );


// =========================
// SHOW MESSAGE
// =========================

function showMessage(
    message,
    type = "success"
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
            "#86efac";
    }
}


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

    if (!user || !user._id) {
        return;
    }

    try {

        bookingsList.innerHTML = `
            <div class="loading-card">

                <h3>
                    Loading bookings...
                </h3>

                <p>
                    Please wait.
                </p>

            </div>
        `;


        const response =
            await fetch(
                `http://localhost:5000/api/bookings/user/${user._id}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load bookings"
            );
        }


        const bookings =
            data.bookings || [];


        updateStatistics(
            bookings
        );


        displayBookings(
            bookings
        );


    } catch (error) {

        console.error(
            "Load bookings error:",
            error
        );


        bookingsList.innerHTML = `
            <div class="empty-card">

                <h3>
                    Unable to Load Bookings
                </h3>

                <p>
                    Please make sure the ParkEase
                    backend server is running.
                </p>

            </div>
        `;

        showMessage(
            error.message ||
            "Unable to load bookings.",
            "error"
        );
    }
}


// =========================
// UPDATE STATISTICS
// =========================

function updateStatistics(
    bookings
) {

    const total =
        bookings.length;


    const confirmed =
        bookings.filter(
            booking =>
                booking.status ===
                "Confirmed"
        ).length;


    const completed =
        bookings.filter(
            booking =>
                booking.status ===
                "Completed"
        ).length;


    const cancelled =
        bookings.filter(
            booking =>
                booking.status ===
                "Cancelled"
        ).length;


    totalBookings.textContent =
        total;

    confirmedBookings.textContent =
        confirmed;

    completedBookings.textContent =
        completed;

    cancelledBookings.textContent =
        cancelled;
}


// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings(
    bookings
) {

    bookingsList.innerHTML = "";


    if (bookings.length === 0) {

        bookingsList.innerHTML = `
            <div class="empty-card">

                <h3>
                    No Bookings Yet
                </h3>

                <p>
                    You have not made any
                    parking bookings.
                </p>

            </div>
        `;

        return;
    }


    bookings.forEach(
        booking => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "booking-item";


            const spot =
                booking.parkingSpotId ||
                {};


            const status =
                booking.status ||
                "Confirmed";


            const bookingId =
                booking.bookingId ||
                "N/A";


            const location =
                spot.location ||
                "N/A";


            const spotNumber =
                spot.spotNumber ||
                "N/A";


            const date =
                booking.date ||
                "N/A";


            const startTime =
                booking.startTime ||
                "N/A";


            const duration =
                booking.duration ||
                0;


            const totalPrice =
                booking.totalPrice ||
                0;


            card.innerHTML = `

                <div class="booking-top">

                    <div class="booking-id">
                        Booking ID:
                        ${bookingId}
                    </div>

                    <div class="booking-status">
                        ${status}
                    </div>

                </div>


                <div class="booking-details">

                    <div class="booking-detail">

                        <span>
                            Parking Location
                        </span>

                        <strong>
                            ${location}
                        </strong>

                    </div>


                    <div class="booking-detail">

                        <span>
                            Parking Spot
                        </span>

                        <strong>
                            ${spotNumber}
                        </strong>

                    </div>


                    <div class="booking-detail">

                        <span>
                            Date
                        </span>

                        <strong>
                            ${date}
                        </strong>

                    </div>


                    <div class="booking-detail">

                        <span>
                            Start Time
                        </span>

                        <strong>
                            ${startTime}
                        </strong>

                    </div>


                    <div class="booking-detail">

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${duration} hour(s)
                        </strong>

                    </div>


                    <div class="booking-detail">

                        <span>
                            Total Price
                        </span>

                        <strong>
                            $${Number(
                                totalPrice
                            ).toFixed(2)}
                        </strong>

                    </div>

                </div>


                <div class="booking-actions">

                    <button
                        class="view-button"
                        onclick="viewBooking('${booking._id}')"
                    >
                        View Booking
                    </button>

                    ${
                        status !== "Cancelled" &&
                        status !== "Completed"
                        ? `
                            <button
                                class="cancel-button"
                                onclick="cancelBooking('${booking._id}')"
                            >
                                Cancel Booking
                            </button>
                        `
                        : ""
                    }

                </div>
            `;


            bookingsList.appendChild(
                card
            );

        }
    );
}


// =========================
// VIEW BOOKING
// =========================

function viewBooking(
    bookingId
) {

    localStorage.setItem(
        "selectedBooking",
        bookingId
    );


    window.location.href =
        "booking-confirmation.html";
}


// =========================
// CANCEL BOOKING
// =========================

async function cancelBooking(
    bookingId
) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        showMessage(
            "Cancelling booking..."
        );


        const response =
            await fetch(
                `http://localhost:5000/api/bookings/${bookingId}/cancel`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to cancel booking"
            );
        }


        showMessage(
            "Booking cancelled successfully."
        );


        // Reload bookings

        await loadBookings();


    } catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to cancel booking.",
            "error"
        );
    }
}


// =========================
// START
// =========================

loadBookings();