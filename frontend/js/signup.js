const form = document.getElementById("signupForm");

form.addEventListener(
    "submit",
    signup
);

async function signup(event) {

    event.preventDefault();

    const user = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,

        college: document.getElementById("college").value.trim(),

        branch: document.getElementById("branch").value.trim(),

        year: document.getElementById("year").value.trim()

    };

    // ============================
    // Client-side Validation
    // ============================

    if (user.name === "") {

        showToast(
            "Please enter your name.",
            "warning"
        );

        return;

    }

    if (user.email === "") {

        showToast(
            "Please enter your email.",
            "warning"
        );

        return;

    }

    if (user.password.length < 8) {

        showToast(
            "Password must be at least 8 characters long.",
            "warning"
        );

        return;

    }

    try {

        const response = await fetch(

            API_URL + "/auth/signup",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(user)

            }

        );

        const data = await response.json();

        if (!response.ok) {

            if (Array.isArray(data.detail)) {

                const error = data.detail[0];

                if (error.loc.includes("password")) {

                    showToast(
                        "Password must be at least 8 characters long.",
                        "warning"
                    );

                }

                else if (error.loc.includes("email")) {

                    showToast(
                        "Please enter a valid email address.",
                        "warning"
                    );

                }

                else if (error.loc.includes("name")) {

                    showToast(
                        "Please enter your name.",
                        "warning"
                    );

                }

                else {

                    showToast(
                        error.msg,
                        "error"
                    );

                }

            }

            else {

                showToast(
                    data.detail || "Signup failed.",
                    "error"
                );

            }

            return;

        }

        showToast(
            "Account created successfully! Redirecting...",
            "success"
        );

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to connect to the server.",
            "error"
        );

    }

}