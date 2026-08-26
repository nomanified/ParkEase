const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");

const loginButton = document.getElementById("loginButton");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.textContent = "Logging in...";

    loginButton.disabled = true;


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            localStorage.setItem(
                "parkEaseToken",
                data.token
            );

            localStorage.setItem(
                "parkEaseUser",
                JSON.stringify(data.user)
            );

            loginMessage.textContent =
                "✓ Login successful!";

            loginMessage.style.color = "#4ade80";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } else {

            loginMessage.textContent =
                data.message || "Login failed.";

            loginMessage.style.color = "#f87171";
        }


    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Unable to connect to server.";

        loginMessage.style.color = "#f87171";
    }


    loginButton.disabled = false;

});