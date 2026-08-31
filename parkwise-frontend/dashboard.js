// =========================
// CHECK LOGIN
// =========================

const token = localStorage.getItem("parkEaseToken");
const userData = localStorage.getItem("parkEaseUser");

if (!token) {
    window.location.href = "login.html";
}


// =========================
// VARIABLES
// =========================

let allParkingSpots = [];


// =========================
// USER INFORMATION
// =========================

if (userData) {
    try {

        const user = JSON.parse(userData);

        const name =
            user.name ||
            user.fullName ||
            "User";

        const email =
            user.email ||
            "user@email.com";

        const userName =
            document.getElementById("userName");

        const userEmail =
            document.getElementById("userEmail");

        const welcomeName =
            document.getElementById("welcomeName");

        if (userName) {
            userName.textContent = name;
        }

        if (userEmail) {
            userEmail.textContent = email;
        }

        if (welcomeName) {
            welcomeName.textContent =
                `Find Your Parking Spot, ${name}`;
        }

    } catch (error) {
        console.error("User data error:", error);
    }
}


// =========================
// DISPLAY PARKING SPOTS
// =========================

function displayParkingSpots(spots) {

    const parkingGrid =
        document.querySelector(".parking-grid");

    if (!parkingGrid) {
        return;
    }

    parkingGrid.innerHTML = "";

    if (spots.length === 0) {

        parkingGrid.innerHTML = `
            <div class="parking-card">
                <h3>No Parking Found</h3>
                <p>
                    No parking spots match
                    your selected filters.
                </p>
            </div>
        `;

        return;
    }


    spots.forEach((spot) => {

        const card =
            document.createElement("div");

        card.className = "parking-card";

        card.innerHTML = `

            <div class="parking-card-top">

                <span class="parking-status">
                    ${spot.status}
                </span>

                <span class="parking-price">
                    $${spot.pricePerHour}/hr
                </span>

            </div>

            <h3>
                ${spot.location}
            </h3>

            <p>
                📍 Location:
                ${spot.location}
            </p>

            <p>
                🅿️ Spot:
                ${spot.spotNumber}
            </p>

            <p>
                🚗 Type:
                ${spot.parkingType}
            </p>

            <p>
                🕐 Available:
                ${spot.availableTime}
            </p>

            <button
                class="view-details-button"
                onclick="viewParkingDetails('${spot._id}')"
            >
                View Details
            </button>
        `;

        parkingGrid.appendChild(card);

    });
}


// =========================
// APPLY SEARCH + FILTERS
// =========================

function applyFilters() {

    const searchInput =
        document.getElementById(
            "parkingSearch"
        );

    const typeFilter =
        document.getElementById(
            "parkingTypeFilter"
        );

    const statusFilter =
        document.getElementById(
            "parkingStatusFilter"
        );

    const priceFilter =
        document.getElementById(
            "parkingPriceFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const selectedPrice =
        priceFilter
            ? priceFilter.value
            : "default";


    // =========================
    // FILTER
    // =========================

    let filteredSpots =
        allParkingSpots.filter((spot) => {

            const location =
                String(spot.location || "")
                    .toLowerCase();

            const spotNumber =
                String(spot.spotNumber || "")
                    .toLowerCase();

            const parkingType =
                String(spot.parkingType || "")
                    .toLowerCase();


            const matchesSearch =
                searchText === "" ||
                location.includes(searchText) ||
                spotNumber.includes(searchText) ||
                parkingType.includes(searchText);


            const matchesType =
                selectedType === "all" ||
                spot.parkingType === selectedType;


            const matchesStatus =
                selectedStatus === "all" ||
                spot.status === selectedStatus;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });


    // =========================
    // SORT BY PRICE
    // =========================

    if (selectedPrice === "low") {

        filteredSpots.sort(
            (a, b) =>
                Number(a.pricePerHour) -
                Number(b.pricePerHour)
        );

    }


    if (selectedPrice === "high") {

        filteredSpots.sort(
            (a, b) =>
                Number(b.pricePerHour) -
                Number(a.pricePerHour)
        );

    }


    // =========================
    // DISPLAY RESULTS
    // =========================

    displayParkingSpots(
        filteredSpots
    );
}


// =========================
// LOAD AVAILABLE PARKING
// =========================

async function loadParkingSpots() {

    const parkingGrid =
        document.querySelector(
            ".parking-grid"
        );

    if (!parkingGrid) {
        return;
    }


    try {

        parkingGrid.innerHTML = `
            <div class="parking-card">
                <h3>
                    Loading parking spots...
                </h3>
                <p>
                    Please wait.
                </p>
            </div>
        `;


        const response = await fetch(
            "http://localhost:5000/api/parking/available"
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load parking spots"
            );

        }


        allParkingSpots =
            data.spots || [];


        applyFilters();


    } catch (error) {

        console.error(
            "Parking loading error:",
            error
        );


        parkingGrid.innerHTML = `
            <div class="parking-card">

                <h3>
                    Unable to Connect
                </h3>

                <p>
                    Please make sure the
                    ParkEase backend server
                    is running.
                </p>

            </div>
        `;
    }
}


// =========================
// SEARCH BUTTON
// =========================

const searchButton =
    document.getElementById(
        "searchButton"
    );

if (searchButton) {

    searchButton.addEventListener(
        "click",
        applyFilters
    );

}


// =========================
// LIVE SEARCH
// =========================

const parkingSearch =
    document.getElementById(
        "parkingSearch"
    );

if (parkingSearch) {

    parkingSearch.addEventListener(
        "input",
        applyFilters
    );

}


// =========================
// PARKING TYPE FILTER
// =========================

const parkingTypeFilter =
    document.getElementById(
        "parkingTypeFilter"
    );

if (parkingTypeFilter) {

    parkingTypeFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =========================
// STATUS FILTER
// =========================

const parkingStatusFilter =
    document.getElementById(
        "parkingStatusFilter"
    );

if (parkingStatusFilter) {

    parkingStatusFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =========================
// PRICE FILTER
// =========================

const parkingPriceFilter =
    document.getElementById(
        "parkingPriceFilter"
    );

if (parkingPriceFilter) {

    parkingPriceFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =========================
// CLEAR FILTERS
// =========================

const clearFilters =
    document.getElementById(
        "clearFilters"
    );

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        () => {

            if (parkingSearch) {
                parkingSearch.value = "";
            }

            if (parkingTypeFilter) {
                parkingTypeFilter.value = "all";
            }

            if (parkingStatusFilter) {
                parkingStatusFilter.value = "all";
            }

            if (parkingPriceFilter) {
                parkingPriceFilter.value = "default";
            }

            applyFilters();

        }
    );

}


// =========================
// VIEW PARKING DETAILS
// =========================

function viewParkingDetails(id) {

    localStorage.setItem(
        "selectedParkingSpot",
        id
    );

    window.location.href = "parking-details.html";
}

// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
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

}


// =========================
// START DASHBOARD
// =========================

loadParkingSpots();