document.addEventListener(
    "DOMContentLoaded",
    initializeProfile
);


// =====================================
// Initialize
// =====================================

async function initializeProfile() {

    if (!getToken()) {

        window.location.href =
            "login.html";

        return;

    }

    await loadUser();

    await loadStatistics();

}


// =====================================
// Load User
// =====================================

async function loadUser() {

    try {

        const response =
            await getCurrentUser();

        if (!response.ok) {

            logout();

            return;

        }

        const user =
            await response.json();

        document.getElementById(
            "userName"
        ).innerText =
        user.name;

        document.getElementById(
            "userEmail"
        ).innerText =
        user.email;

        document.getElementById(
            "college"
        ).innerText =
        user.college || "-";

        document.getElementById(
            "branch"
        ).innerText =
        user.branch || "-";

        document.getElementById(
            "year"
        ).innerText =
        user.year || "-";

        document.getElementById(
            "avatarLetter"
        ).innerText =
        user.name.charAt(0).toUpperCase();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to load profile.",
            "error"
        );

    }

}


// =====================================
// Statistics
// =====================================

async function loadStatistics() {

    try {

        let totalVersions = 0;

        let totalATS = 0;

        let atsCount = 0;

        const groupResponse =
            await getResumeGroups();

        if (!groupResponse.ok) {

            return;

        }

        const groups =
            await groupResponse.json();

        document.getElementById(
            "groupCount"
        ).innerText =
        groups.length;

        for (const group of groups) {

            const versionResponse =
                await getResumeVersions(
                    group.id
                );

            if (!versionResponse.ok) {

                continue;

            }

            const versions =
                await versionResponse.json();

            totalVersions +=
                versions.length;

            versions.forEach(version => {

                totalATS +=
                    version.ats_score;

                atsCount++;

            });

        }

        document.getElementById(
            "versionCount"
        ).innerText =
        totalVersions;

        document.getElementById(
            "averageATS"
        ).innerText =

            atsCount === 0

            ? "0%"

            : Math.round(
                totalATS / atsCount
            ) + "%";

        const appResponse =
            await getApplications();

        if (appResponse.ok) {

            const applications =
                await appResponse.json();

            document.getElementById(
                "applicationCount"
            ).innerText =
            applications.length;

        }

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to load statistics.",
            "error"
        );

    }

}


// =====================================
// Logout
// =====================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "login.html";

}
