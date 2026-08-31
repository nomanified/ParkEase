// =========================
// CHECK ADMIN LOGIN
// =========================

const token =
    localStorage.getItem("parkEaseToken");

const userData =
    localStorage.getItem("parkEaseUser");


if (!token) {

    window.location.href =
        "login.html";
}


// =========================
// GET USER
// =========================

let user = null;


if (userData) {

    try {

        user =
            JSON.parse(userData);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}


// =========================
// CHECK ADMIN
// =========================

if (
    user &&
    user.role &&
    user.role !== "admin"
) {

    alert(
        "Admin access required."
    );

    window.location.href =
        "dashboard.html";
}


// =========================
// ELEMENTS
// =========================

const totalUsers =
    document.getElementById(
        "totalUsers"
    );

const totalSpots =
    document.getElementById(
        "totalSpots"
    );

const totalBookings =
    document.getElementById(
        "totalBookings"
    );

const activeBookings =
    document.getElementById(
        "activeBookings"
    );

const recentBookings =
    document.getElementById(
        "recentBookings"
    );

const parkingOverview =
    document.getElementById(
        "parkingOverview"
    );


// =========================
// LOAD PARKING
// =========================

async function loadParking() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/parking"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load parking"
            );

        }


        const spots =
            data.spots || [];


        totalSpots.textContent =
            spots.length;


        displayParking(
            spots
        );


    } catch (error) {

        console.error(
            "Parking error:",
            error
        );


        parkingOverview.innerHTML = `
            <div class="empty-box">

                <h3>
                    Unable to Load Parking
                </h3>

                <p>
                    Check your backend API.
                </p>

            </div>
        `;

    }

}


// =========================
// DISPLAY PARKING
// =========================

function displayParking(spots) {

    parkingOverview.innerHTML = "";


    if (spots.length === 0) {

        parkingOverview.innerHTML = `
            <div class="empty-box">

                <h3>
                    No Parking Spots
                </h3>

                <p>
                    No parking spots available.
                </p>

            </div>
        `;

        return;
    }


    spots.slice(0, 5).forEach(
        (spot) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "parking-item";


            item.innerHTML = `

                <div>

                    <div class="item-title">
                        ${spot.spotNumber || "N/A"}
                    </div>

                    <div class="item-info">

                        📍 ${spot.location || "N/A"}
                        <br>

                        🚗 ${spot.parkingType || "N/A"}
                        <br>

                        💰 $${spot.pricePerHour || 0}/hour

                    </div>

                </div>

                <span class="item-status">

                    ${spot.status || "Unknown"}

                </span>

            `;


            parkingOverview.appendChild(
                item
            );

        }
    );

}


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

    try {

        /*
         * Temporary admin booking
         * endpoint.
         *
         * We will create the proper
         * admin endpoint in backend
         * next.
         */

        const response =
            await fetch(
                "http://localhost:5000/api/bookings"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load bookings"
            );

        }


        const data =
            await response.json();


        const bookings =
            data.bookings || [];


        totalBookings.textContent =
            bookings.length;


        const active =
            bookings.filter(
                booking =>
                    booking.status ===
                    "Active" ||
                    booking.status ===
                    "Confirmed"
            );


        activeBookings.textContent =
            active.length;


        displayBookings(
            bookings
        );


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        recentBookings.innerHTML = `
            <div class="empty-box">

                <h3>
                    Booking API Not Ready
                </h3>

                <p>
                    Admin booking API will be
                    connected next.
                </p>

            </div>
        `;

    }

}


// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings(
    bookings
) {

    recentBookings.innerHTML = "";


    if (bookings.length === 0) {

        recentBookings.innerHTML = `
            <div class="empty-box">

                <h3>
                    No Bookings
                </h3>

                <p>
                    No bookings found.
                </p>

            </div>
        `;

        return;
    }


    bookings
        .slice(0, 5)
        .forEach(
            (booking) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "booking-item";


                const spot =
                    booking.parkingSpotId;


                item.innerHTML = `

                    <div>

                        <div class="item-title">

                            ${booking.bookingId || "N/A"}

                        </div>

                        <div class="item-info">

                            🅿️ ${
                                spot &&
                                spot.spotNumber
                                    ? spot.spotNumber
                                    : "N/A"
                            }

                            <br>

                            📅 ${
                                booking.date ||
                                "N/A"
                            }

                            <br>

                            💰 $${booking.totalPrice || 0}

                        </div>

                    </div>


                    <span class="item-status">

                        ${booking.status || "Unknown"}

                    </span>

                `;


                recentBookings.appendChild(
                    item
                );

            }
        );

}


// =========================
// REFRESH
// =========================

const refreshButton =
    document.getElementById(
        "refreshButton"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        () => {

            loadDashboard();

        }
    );

}


// =========================
// QUICK ACTIONS
// =========================

document
    .getElementById(
        "manageUsersButton"
    )
    ?.addEventListener(
        "click",
        () => {

            alert(
                "User management will be connected next."
            );

        }
    );


document
    .getElementById(
        "manageParkingButton"
    )
    ?.addEventListener(
        "click",
        () => {

            alert(
                "Parking management will be connected next."
            );

        }
    );


document
    .getElementById(
        "manageBookingsButton"
    )
    ?.addEventListener(
        "click",
        () => {

            alert(
                "Booking management will be connected next."
            );

        }
    );


// =========================
// LOGOUT
// =========================

document
    .getElementById(
        "logoutButton"
    )
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "parkEaseToken"
            );

            localStorage.removeItem(
                "parkEaseUser"
            );

            window.location.href =
                "login.html";

        }
    );


// =========================
// LOAD DASHBOARD
// =========================

async function loadDashboard() {

    await loadParking();

    await loadBookings();

}


loadDashboard();