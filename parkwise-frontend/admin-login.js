// =========================
// ADMIN LOGIN
// =========================

const adminLoginForm =
    document.getElementById("adminLoginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const messageElement =
    document.getElementById("message");


// =========================
// SHOW MESSAGE
// =========================

function showMessage(message, type = "error") {

    messageElement.textContent = message;

    if (type === "success") {

        messageElement.style.color =
            "#86efac";

    } else {

        messageElement.style.color =
            "#fca5a5";
    }
}


// =========================
// ADMIN LOGIN
// =========================

adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        // =========================
        // VALIDATION
        // =========================

        if (!email) {

            showMessage(
                "Please enter admin email."
            );

            return;
        }


        if (!password) {

            showMessage(
                "Please enter password."
            );

            return;
        }


        try {

            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";


            showMessage(
                "Checking admin credentials...",
                "success"
            );


            // =========================
            // LOGIN API
            // =========================

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email: email,

                            password: password

                        })
                    }
                );


            const data =
                await response.json();


            // =========================
            // LOGIN ERROR
            // =========================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );
            }


            // =========================
            // GET USER
            // =========================

            const loggedInUser =
                data.user;


            // =========================
            // CHECK ADMIN ROLE
            // =========================

            if (
                !loggedInUser ||
                String(loggedInUser.role)
                    .toLowerCase() !== "admin"
            ) {

                showMessage(
                    "Access denied. Admin account required."
                );

                return;
            }


            // =========================
            // SAVE ADMIN SESSION
            // =========================

            localStorage.setItem(
                "parkEaseToken",
                data.token
            );


            localStorage.setItem(
                "parkEaseUser",
                JSON.stringify(loggedInUser)
            );


            localStorage.setItem(
                "parkEaseAdmin",
                "true"
            );


            // =========================
            // SUCCESS
            // =========================

            showMessage(
                "Admin login successful. Redirecting...",
                "success"
            );


            // =========================
            // ADMIN DASHBOARD
            // =========================

            setTimeout(
                () => {

                    window.location.href =
                        "admin-dashboard.html";

                },
                700
            );


        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to login."
            );


        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Login to Admin Panel";
        }

    }
);