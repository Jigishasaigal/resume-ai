const form = document.getElementById("loginForm");

const error =
    document.getElementById(
        "errorMessage"
    );

form.addEventListener(
    "submit",
    login
);


// =====================================
// Login
// =====================================

async function login(event) {

    event.preventDefault();

    error.textContent = "";

    const email =
        document
        .getElementById("email")
        .value
        .trim();

    const password =
        document
        .getElementById("password")
        .value;

    // ===========================
    // Validation
    // ===========================

    if (email === "") {

        showToast(
            "Please enter your email.",
            "warning"
        );

        return;

    }

    if (password === "") {

        showToast(
            "Please enter your password.",
            "warning"
        );

        return;

    }

    const body =
        new URLSearchParams();

    body.append(
        "username",
        email
    );

    body.append(
        "password",
        password
    );

    try {

        const response =
            await fetch(

                API_URL +
                "/auth/login",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/x-www-form-urlencoded"

                    },

                    body: body

                }

            );

        const data =
            await response.json();

        if (!response.ok) {

            error.textContent =
                data.detail ||
                "Invalid email or password.";

            showToast(
                "Login failed.",
                "error"
            );

            return;

        }

        saveToken(
            data.access_token
        );

        showToast(
            "Login Successful!",
            "success"
        );

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 800);

    }

    catch (err) {

        console.error(err);

        error.textContent =
            "Unable to connect to the server.";

        showToast(
            "Unable to connect to the server.",
            "error"
        );

    }

}