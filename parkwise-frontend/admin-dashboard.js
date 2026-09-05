// =========================
// CHECK ADMIN LOGIN
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

if (userData) {
    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error("User data error:", error);
    }
}


// =========================
// CHECK ADMIN
// =========================

if (
    !user ||
    !user.role ||
    String(user.role).toLowerCase() !== "admin"
) {
    alert("Admin access required.");
    window.location.href = "login.html";
}


// =========================
// ELEMENTS
// =========================

const totalUsers =
    document.getElementById("totalUsers");

const totalSpots =
    document.getElementById("totalSpots");

const totalBookings =
    document.getElementById("totalBookings");

const activeBookings =
    document.getElementById("activeBookings");

const recentBookings =
    document.getElementById("recentBookings");

const parkingOverview =
    document.getElementById("parkingOverview");

const parkingManagementList =
    document.getElementById("parkingManagementList");

const parkingModal =
    document.getElementById("parkingModal");

const parkingForm =
    document.getElementById("parkingForm");

const addParkingButton =
    document.getElementById("addParkingButton");

const closeParkingModal =
    document.getElementById("closeParkingModal");

const parkingModalTitle =
    document.getElementById("parkingModalTitle");

const parkingFormMessage =
    document.getElementById("parkingFormMessage");


// =========================
// FORM ELEMENTS
// =========================

const parkingId =
    document.getElementById("parkingId");

const spotNumber =
    document.getElementById("spotNumber");

const parkingLocation =
    document.getElementById("parkingLocation");

const parkingType =
    document.getElementById("parkingType");

const pricePerHour =
    document.getElementById("pricePerHour");

const parkingStatus =
    document.getElementById("parkingStatus");

const availableTime =
    document.getElementById("availableTime");

const parkingInstructions =
    document.getElementById("parkingInstructions");

const parkingDescription =
    document.getElementById("parkingDescription");

const saveParkingButton =
    document.getElementById("saveParkingButton");


// =========================
// API URL
// =========================

const API =
    "http://localhost:5000";


// =========================
// PARKING DATA
// =========================

let parkingSpots = [];


// =========================
// LOAD DASHBOARD
// =========================

async function loadDashboard() {

    await loadAdminStats();

    await loadParking();

    await loadBookings();

}


// =========================
// LOAD ADMIN STATS
// =========================

async function loadAdminStats() {

    try {

        const response =
            await fetch(
                `${API}/api/admin/stats`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load statistics"
            );
        }

        const stats =
            data.stats || {};

        if (totalUsers) {
            totalUsers.textContent =
                stats.totalUsers || 0;
        }

        if (totalSpots) {
            totalSpots.textContent =
                stats.totalParkingSpots || 0;
        }

        if (totalBookings) {
            totalBookings.textContent =
                stats.totalBookings || 0;
        }

        if (activeBookings) {
            activeBookings.textContent =
                (
                    Number(stats.confirmedBookings || 0) +
                    Number(stats.reservedSpots || 0)
                );
        }

    } catch (error) {

        console.error(
            "Admin stats error:",
            error
        );

    }

}


// =========================
// LOAD PARKING
// =========================

async function loadParking() {

    try {

        const response =
            await fetch(
                `${API}/api/parking`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load parking"
            );

        }

        parkingSpots =
            data.spots || [];

        if (totalSpots) {
            totalSpots.textContent =
                parkingSpots.length;
        }

        displayParking(
            parkingSpots
        );

        displayParkingManagement(
            parkingSpots
        );

    } catch (error) {

        console.error(
            "Parking error:",
            error
        );

        if (parkingOverview) {

            parkingOverview.innerHTML = `
                <div class="empty-box">

                    <h3>
                        Unable to Load Parking
                    </h3>

                    <p>
                        Check your backend server.
                    </p>

                </div>
            `;
        }

        if (parkingManagementList) {

            parkingManagementList.innerHTML = `
                <div class="empty-box">

                    <h3>
                        Unable to Load Parking
                    </h3>

                    <p>
                        Check your backend server.
                    </p>

                </div>
            `;
        }

    }

}


// =========================
// DISPLAY PARKING OVERVIEW
// =========================

function displayParking(spots) {

    if (!parkingOverview) {
        return;
    }

    parkingOverview.innerHTML = "";

    if (spots.length === 0) {

        parkingOverview.innerHTML = `
            <div class="empty-box">

                <h3>
                    No Parking Spots
                </h3>

                <p>
                    Add your first parking spot.
                </p>

            </div>
        `;

        return;
    }


    spots.slice(0, 5).forEach(
        (spot) => {

            const item =
                document.createElement("div");

            item.className =
                "parking-item";

            item.innerHTML = `

                <div>

                    <div class="item-title">
                        ${escapeHTML(
                            spot.spotNumber || "N/A"
                        )}
                    </div>

                    <div class="item-info">

                        📍 ${escapeHTML(
                            spot.location || "N/A"
                        )}

                        <br>

                        🚗 ${escapeHTML(
                            spot.parkingType || "N/A"
                        )}

                        <br>

                        💰 $${Number(
                            spot.pricePerHour || 0
                        )}/hour

                    </div>

                </div>

                <span class="item-status">
                    ${escapeHTML(
                        spot.status || "Unknown"
                    )}
                </span>

            `;

            parkingOverview.appendChild(item);

        }
    );

}


// =========================
// DISPLAY PARKING MANAGEMENT
// =========================

function displayParkingManagement(spots) {

    if (!parkingManagementList) {
        return;
    }

    parkingManagementList.innerHTML = "";


    if (spots.length === 0) {

        parkingManagementList.innerHTML = `
            <div class="empty-box">

                <h3>
                    No Parking Spots
                </h3>

                <p>
                    Click "Add Parking Spot"
                    to create one.
                </p>

            </div>
        `;

        return;
    }


    spots.forEach(
        (spot) => {

            const item =
                document.createElement("div");

            item.className =
                "parking-item";

            item.innerHTML = `

                <div>

                    <div class="item-title">
                        🅿️ ${escapeHTML(
                            spot.spotNumber || "N/A"
                        )}
                    </div>

                    <div class="item-info">

                        📍 ${escapeHTML(
                            spot.location || "N/A"
                        )}

                        <br>

                        🚗 ${escapeHTML(
                            spot.parkingType || "N/A"
                        )}

                        <br>

                        💰 $${Number(
                            spot.pricePerHour || 0
                        )}/hour

                        <br>

                        🕐 ${escapeHTML(
                            spot.availableTime ||
                            "24 Hours"
                        )}

                    </div>

                </div>


                <div class="parking-actions">

                    <span class="item-status">
                        ${escapeHTML(
                            spot.status || "Unknown"
                        )}
                    </span>

                    <button
                        type="button"
                        class="action-button edit-parking"
                        data-id="${spot._id}"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        class="action-button delete-parking"
                        data-id="${spot._id}"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;

            parkingManagementList.appendChild(
                item
            );

        }
    );


    // EDIT BUTTONS

    document
        .querySelectorAll(".edit-parking")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    openEditParking(
                        id
                    );

                }
            );

        });


    // DELETE BUTTONS

    document
        .querySelectorAll(".delete-parking")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    deleteParking(
                        id
                    );

                }
            );

        });

}


// =========================
// OPEN ADD MODAL
// =========================

function openAddParking() {

    if (!parkingModal) {
        return;
    }

    parkingModalTitle.textContent =
        "Add Parking Spot";

    parkingForm.reset();

    parkingId.value = "";

    parkingStatus.value =
        "Available";

    availableTime.value =
        "24 Hours";

    parkingFormMessage.textContent =
        "";

    parkingModal.style.display =
        "flex";

}


// =========================
// OPEN EDIT MODAL
// =========================

function openEditParking(id) {

    const spot =
        parkingSpots.find(
            item =>
                String(item._id) ===
                String(id)
        );

    if (!spot) {

        alert(
            "Parking spot not found."
        );

        return;
    }


    parkingModalTitle.textContent =
        "Edit Parking Spot";


    parkingId.value =
        spot._id || "";


    spotNumber.value =
        spot.spotNumber || "";


    parkingLocation.value =
        spot.location || "";


    parkingType.value =
        spot.parkingType || "";


    pricePerHour.value =
        spot.pricePerHour || 0;


    parkingStatus.value =
        spot.status || "Available";


    availableTime.value =
        spot.availableTime ||
        "24 Hours";


    parkingInstructions.value =
        spot.instructions || "";


    parkingDescription.value =
        spot.description || "";


    parkingFormMessage.textContent =
        "";


    parkingModal.style.display =
        "flex";

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    if (parkingModal) {

        parkingModal.style.display =
            "none";

    }

}


// =========================
// SAVE PARKING
// =========================

async function saveParking(event) {

    event.preventDefault();


    const id =
        parkingId.value.trim();


    const payload = {

        spotNumber:
            spotNumber.value.trim(),

        location:
            parkingLocation.value.trim(),

        parkingType:
            parkingType.value,

        pricePerHour:
            Number(pricePerHour.value),

        status:
            parkingStatus.value,

        availableTime:
            availableTime.value.trim(),

        instructions:
            parkingInstructions.value.trim(),

        description:
            parkingDescription.value.trim()

    };


    if (!payload.spotNumber) {

        parkingFormMessage.textContent =
            "Please enter spot number.";

        return;
    }


    if (!payload.location) {

        parkingFormMessage.textContent =
            "Please enter location.";

        return;
    }


    if (!payload.parkingType) {

        parkingFormMessage.textContent =
            "Please select parking type.";

        return;
    }


    if (
        Number.isNaN(
            payload.pricePerHour
        ) ||
        payload.pricePerHour < 0
    ) {

        parkingFormMessage.textContent =
            "Please enter a valid price.";

        return;
    }


    try {

        saveParkingButton.disabled =
            true;

        saveParkingButton.textContent =
            id
                ? "Updating..."
                : "Creating...";


        const url =
            id
                ? `${API}/api/parking/${id}`
                : `${API}/api/parking`;


        const method =
            id
                ? "PUT"
                : "POST";


        const response =
            await fetch(
                url,
                {

                    method,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save parking spot."
            );

        }


        parkingFormMessage.style.color =
            "#86efac";

        parkingFormMessage.textContent =
            id
                ? "Parking spot updated successfully."
                : "Parking spot created successfully.";


        await loadDashboard();


        setTimeout(
            () => {

                closeModal();

            },
            700
        );


    } catch (error) {

        console.error(
            "Save parking error:",
            error
        );


        parkingFormMessage.style.color =
            "#fca5a5";

        parkingFormMessage.textContent =
            error.message ||
            "Unable to save parking spot.";

    } finally {

        saveParkingButton.disabled =
            false;

        saveParkingButton.textContent =
            "Save Parking Spot";

    }

}


// =========================
// DELETE PARKING
// =========================

async function deleteParking(id) {

    const spot =
        parkingSpots.find(
            item =>
                String(item._id) ===
                String(id)
        );


    const spotName =
        spot
            ? spot.spotNumber
            : "this parking spot";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${spotName}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/api/parking/${id}`,
                {

                    method: "DELETE",

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
                "Unable to delete parking spot."
            );

        }


        alert(
            "Parking spot deleted successfully."
        );


        await loadDashboard();


    } catch (error) {

        console.error(
            "Delete parking error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete parking spot."
        );

    }

}


// =========================
// CHANGE PARKING STATUS
// =========================

async function changeParkingStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(
                `${API}/api/parking/${id}/status`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to change status."
            );

        }


        await loadDashboard();


    } catch (error) {

        console.error(
            "Status change error:",
            error
        );


        alert(
            error.message ||
            "Unable to change parking status."
        );

    }

}


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

    try {

        const response =
            await fetch(
                `${API}/api/admin/bookings`
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


        if (totalBookings) {

            totalBookings.textContent =
                bookings.length;

        }


        const active =
            bookings.filter(
                booking =>
                    booking.status === "Active" ||
                    booking.status === "Confirmed"
            );


        if (activeBookings) {

            activeBookings.textContent =
                active.length;

        }


        displayBookings(
            bookings
        );


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        if (recentBookings) {

            recentBookings.innerHTML = `
                <div class="empty-box">

                    <h3>
                        Unable to Load Bookings
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>
            `;

        }

    }

}


// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings(
    bookings
) {

    if (!recentBookings) {
        return;
    }


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

                            ${escapeHTML(
                                booking.bookingId ||
                                "N/A"
                            )}

                        </div>

                        <div class="item-info">

                            🅿️ ${
                                spot &&
                                spot.spotNumber
                                    ? escapeHTML(
                                        spot.spotNumber
                                    )
                                    : "N/A"
                            }

                            <br>

                            📅 ${
                                escapeHTML(
                                    booking.date ||
                                    "N/A"
                                )
                            }

                            <br>

                            💰 $${Number(
                                booking.totalPrice || 0
                            )}

                        </div>

                    </div>


                    <span class="item-status">

                        ${escapeHTML(
                            booking.status ||
                            "Unknown"
                        )}

                    </span>

                `;


                recentBookings.appendChild(
                    item
                );

            }
        );

}


// =========================
// REFRESH BUTTON
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
// ADD PARKING BUTTON
// =========================

if (addParkingButton) {

    addParkingButton.addEventListener(
        "click",
        openAddParking
    );

}


// =========================
// CLOSE MODAL BUTTON
// =========================

if (closeParkingModal) {

    closeParkingModal.addEventListener(
        "click",
        closeModal
    );

}


// =========================
// FORM SUBMIT
// =========================

if (parkingForm) {

    parkingForm.addEventListener(
        "submit",
        saveParking
    );

}


// =========================
// CLOSE MODAL OUTSIDE
// =========================

if (parkingModal) {

    parkingModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                parkingModal
            ) {

                closeModal();

            }

        }
    );

}


// =========================
// QUICK ACTIONS
// =========================

document
    .getElementById("manageUsersButton")
    ?.addEventListener(
        "click",
        () => {

            alert(
                "User management will be added next."
            );

        }
    );


document
    .getElementById("manageParkingButton")
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "addParkingButton"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById("manageBookingsButton")
    ?.addEventListener(
        "click",
        () => {

            alert(
                "Booking management will be added next."
            );

        }
    );


// =========================
// LOGOUT
// =========================

document
    .getElementById("logoutButton")
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "parkEaseToken"
            );

            localStorage.removeItem(
                "parkEaseUser"
            );

            localStorage.removeItem(
                "parkEaseAdmin"
            );

            window.location.href =
                "login.html";

        }
    );


// =========================
// HTML SECURITY HELPER
// =========================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================
// START
// =========================

loadDashboard();