const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

const registerButton = document.getElementById("registerButton");


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;


    message.textContent = "Creating your account...";


    registerButton.disabled = true;

    registerButton.style.opacity = "0.7";


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            message.textContent =
                "✓ Account created successfully!";

            message.style.color = "#4ade80";

            registerForm.reset();

        } else {

            message.textContent =
                data.message || "Registration failed.";

            message.style.color = "#f87171";
        }


    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#f87171";
    }


    registerButton.disabled = false;

    registerButton.style.opacity = "1";

});