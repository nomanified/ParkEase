const token = localStorage.getItem("parkEaseToken");
const userData = localStorage.getItem("parkEaseUser");

// =========================
// CHECK LOGIN
// =========================

if (!token) {
    window.location.href = "login.html";
}


// =========================
// LOAD USER INFORMATION
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

        document.getElementById("profileName").textContent = name;

        document.getElementById("profileEmail").textContent = email;

        document.getElementById("fullName").textContent = name;

        document.getElementById("emailAddress").textContent = email;

        document.getElementById("profileAvatar").textContent =
            name.charAt(0).toUpperCase();

    } catch (error) {
        console.error("User data error:", error);
    }
}


// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("parkEaseToken");

        localStorage.removeItem("parkEaseUser");

        window.location.href = "login.html";
    });
}