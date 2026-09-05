// =========================
// ADMIN CHECK
// =========================

const token =
    localStorage.getItem("parkEaseToken");

const admin =
    localStorage.getItem("parkEaseAdmin");

if (!token || admin !== "true") {

    window.location.href =
        "admin-login.html";
}


// =========================
// ELEMENTS
// =========================

const parkingForm =
    document.getElementById("parkingForm");

const parkingList =
    document.getElementById("parkingList");

const message =
    document.getElementById("message");

const searchParking =
    document.getElementById("searchParking");

const saveButton =
    document.getElementById("saveButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");


// =========================
// VARIABLES
// =========================

let allParkingSpots = [];


// =========================
// MESSAGE
// =========================

function showMessage(text, type = "success") {

    message.textContent = text;

    message.style.color =
        type === "error"
            ? "#fca5a5"
            : "#86efac";
}


// =========================
// LOAD PARKING
// =========================

async function loadParking() {

    parkingList.innerHTML = `
        <div class="loading-card">
            <h3>Loading parking spots...</h3>
            <p>Please wait.</p>
        </div>
    `;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/admin/parking",
                {
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
                "Unable to load parking spots."
            );
        }

        allParkingSpots =
            data.spots || [];

        displayParking(
            allParkingSpots
        );

    } catch (error) {

        console.error(error);

        parkingList.innerHTML = `
            <div class="empty-card">
                <h3>Unable to Load Parking</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}


// =========================
// DISPLAY PARKING
// =========================

function displayParking(spots) {

    parkingList.innerHTML = "";

    if (spots.length === 0) {

        parkingList.innerHTML = `
            <div class="empty-card">
                <h3>No Parking Spots</h3>
                <p>Add your first parking spot above.</p>
            </div>
        `;

        return;
    }


    spots.forEach(spot => {

        const item =
            document.createElement("div");

        item.className =
            "parking-item";


        item.innerHTML = `

            <div class="parking-top">

                <h3>
                    ${spot.spotNumber || "N/A"}
                </h3>

                <span class="status">
                    ${spot.status || "N/A"}
                </span>

            </div>

            <p>
                📍 <strong>Location:</strong>
                ${spot.location || "N/A"}
            </p>

            <p>
                🚗 <strong>Type:</strong>
                ${spot.parkingType || "N/A"}
            </p>

            <p>
                💰 <strong>Price:</strong>
                $${spot.pricePerHour || 0}/hour
            </p>

            <p>
                🕐 <strong>Available:</strong>
                ${spot.availableTime || "24 Hours"}
            </p>

            <p>
                📝 <strong>Description:</strong>
                ${spot.description || "N/A"}
            </p>

            <div class="parking-actions">

                <button
                    class="edit-button"
                    onclick="editParking('${spot._id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteParking('${spot._id}')"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        parkingList.appendChild(item);

    });
}


// =========================
// ADD / UPDATE
// =========================

parkingForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const spotId =
            document.getElementById(
                "spotId"
            ).value;


        const parkingData = {

            spotNumber:
                document.getElementById(
                    "spotNumber"
                ).value.trim(),

            location:
                document.getElementById(
                    "location"
                ).value.trim(),

            parkingType:
                document.getElementById(
                    "parkingType"
                ).value,

            pricePerHour:
                Number(
                    document.getElementById(
                        "pricePerHour"
                    ).value
                ),

            status:
                document.getElementById(
                    "status"
                ).value,

            availableTime:
                document.getElementById(
                    "availableTime"
                ).value.trim(),

            instructions:
                document.getElementById(
                    "instructions"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim()
        };


        try {

            saveButton.disabled = true;

            saveButton.textContent =
                spotId
                    ? "Updating..."
                    : "Adding...";


            const url =
                spotId
                    ? `http://localhost:5000/api/admin/parking/${spotId}`
                    : "http://localhost:5000/api/admin/parking";


            const method =
                spotId
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(
                                parkingData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Operation failed."
                );
            }


            showMessage(
                spotId
                    ? "Parking spot updated successfully."
                    : "Parking spot added successfully."
            );


            resetForm();

            loadParking();


        } catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Unable to save parking spot.",
                "error"
            );

        } finally {

            saveButton.disabled = false;

            saveButton.textContent =
                "Add Parking Spot";
        }

    }
);


// =========================
// EDIT PARKING
// =========================

function editParking(id) {

    const spot =
        allParkingSpots.find(
            item => item._id === id
        );


    if (!spot) {
        return;
    }


    document.getElementById(
        "spotId"
    ).value = spot._id;


    document.getElementById(
        "spotNumber"
    ).value = spot.spotNumber || "";


    document.getElementById(
        "location"
    ).value = spot.location || "";


    document.getElementById(
        "parkingType"
    ).value = spot.parkingType || "";


    document.getElementById(
        "pricePerHour"
    ).value = spot.pricePerHour || "";


    document.getElementById(
        "status"
    ).value = spot.status || "Available";


    document.getElementById(
        "availableTime"
    ).value =
        spot.availableTime || "";


    document.getElementById(
        "instructions"
    ).value =
        spot.instructions || "";


    document.getElementById(
        "description"
    ).value =
        spot.description || "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Parking Spot";


    saveButton.textContent =
        "Update Parking Spot";


    cancelEditButton.style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================
// DELETE PARKING
// =========================

async function deleteParking(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this parking spot?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/admin/parking/${id}`,
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
                "Unable to delete parking."
            );
        }


        showMessage(
            "Parking spot deleted successfully."
        );


        loadParking();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message ||
            "Delete failed.",
            "error"
        );
    }
}


// =========================
// RESET FORM
// =========================

function resetForm() {

    parkingForm.reset();

    document.getElementById(
        "spotId"
    ).value = "";

    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Parking Spot";

    saveButton.textContent =
        "Add Parking Spot";

    cancelEditButton.style.display =
        "none";
}


// =========================
// CANCEL EDIT
// =========================

cancelEditButton.addEventListener(
    "click",
    resetForm
);


// =========================
// SEARCH
// =========================

searchParking.addEventListener(
    "input",
    function() {

        const search =
            searchParking.value
                .trim()
                .toLowerCase();


        const filtered =
            allParkingSpots.filter(
                spot => {

                    return (
                        String(
                            spot.spotNumber || ""
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            spot.location || ""
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            spot.parkingType || ""
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            spot.status || ""
                        )
                        .toLowerCase()
                        .includes(search)
                    );
                }
            );


        displayParking(filtered);

    }
);


// =========================
// LOGOUT
// =========================

document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    function() {

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
            "admin-login.html";
    }
);


// =========================
// START
// =========================

loadParking();