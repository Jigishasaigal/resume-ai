document.addEventListener(
    "DOMContentLoaded",
    initializeApplications
);

// ======================================
// Elements
// ======================================

const applicationsList =
    document.getElementById(
        "applicationsList"
    );

const searchBox =
    document.getElementById(
        "searchBox"
    );

const addApplicationBtn =
    document.getElementById(
        "addApplicationBtn"
    );

let applications = [];


// ======================================
// Initialize
// ======================================

async function initializeApplications() {

    if (!getToken()) {

        window.location.href =
            "login.html";

        return;

    }

    addApplicationBtn.addEventListener(
        "click",
        openAddModal
    );

    document
        .getElementById("applicationStatus")
        .addEventListener(
            "change",
            toggleStatusOther
        );

    searchBox.addEventListener(
        "input",
        searchApplications
    );

    await loadApplications();

}


// ======================================
// Toggle "Other" Status Input
// ======================================

function toggleStatusOther() {

    const select =
        document.getElementById(
            "applicationStatus"
        );

    const otherInput =
        document.getElementById(
            "applicationStatusOther"
        );

    if (select.value === "Other") {

        otherInput.style.display = "block";

        otherInput.focus();

    }

    else {

        otherInput.style.display = "none";

        otherInput.value = "";

    }

}


// ======================================
// Load Applications
// ======================================

async function loadApplications() {

    try {

        const response =
            await getApplications();

        if (!response.ok) {

            showToast(
                "Unable to load applications.",
                "error"
            );

            return;

        }

        applications =
            await response.json();

        updateStatistics();

        displayApplications(
            applications
        );

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to connect to the server.",
            "error"
        );

    }

}


// ======================================
// Statistics
// ======================================

function updateStatistics() {

    document.getElementById(
        "totalApplications"
    ).innerText =
    applications.length;

    document.getElementById(
        "interviewCount"
    ).innerText =
    applications.filter(

        app =>

        app.status === "Interview"

    ).length;

    document.getElementById(
        "offerCount"
    ).innerText =
    applications.filter(

        app =>

        app.status === "Offer"

    ).length;

    document.getElementById(
        "rejectedCount"
    ).innerText =
    applications.filter(

        app =>

        app.status === "Rejected"

    ).length;

}


// ======================================
// Display Applications
// ======================================

function displayApplications(data) {

    applicationsList.innerHTML = "";

    if (data.length === 0) {

        applicationsList.innerHTML = `

            <div class="empty">

                <h2>

                    No Applications Found

                </h2>

                <p>

                    Click "Add Application"
                    to start tracking jobs.

                </p>

            </div>

        `;

        return;

    }

    data.forEach(app => {

        applicationsList.innerHTML += `

        <div class="card application-card">

            <div class="application-left">

                <h2>

                    ${app.company_name}

                </h2>

                <p>

                    ${app.job_role}

                </p>

                <span class="status ${app.status}">

                    ${app.status}

                </span>

            </div>

            <div class="application-buttons">

                <button

                    class="btn btn-secondary"

                    onclick="viewJob('${app.job_link}')">

                    View Job

                </button>

                <button

                    class="btn btn-primary"

                    onclick="editApplication(${app.id})">

                    Edit

                </button>

                <button

                    class="btn btn-danger"

                    onclick="deleteApplicationById(${app.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}


// ======================================
// Search
// ======================================

function searchApplications() {

    const keyword =
        searchBox.value
        .toLowerCase();

    const filtered =

        applications.filter(app =>

            app.company_name
                .toLowerCase()
                .includes(keyword)

            ||

            app.job_role
                .toLowerCase()
                .includes(keyword)

        );

    displayApplications(
        filtered
    );

}


// ======================================
// View Job
// ======================================

function viewJob(url) {

    if (!url) {

        showToast(

            "Job link not available.",

            "warning"

        );

        return;

    }

    if (!/^https?:\/\//i.test(url)) {

        url = "https://" + url;

    }

    window.open(

        url,

        "_blank"

    );

}


// ======================================
// Open Add Modal
// ======================================

function openAddModal() {

    document.getElementById(
        "modalTitle"
    ).innerText =
    "Add Application";

    document.getElementById(
        "applicationId"
    ).value = "";

    document.getElementById(
        "companyName"
    ).value = "";

    document.getElementById(
        "jobRole"
    ).value = "";

    document.getElementById(
        "applicationStatus"
    ).value =
    "Applied";

    document.getElementById(
        "applicationStatusOther"
    ).style.display = "none";

    document.getElementById(
        "applicationStatusOther"
    ).value = "";

    document.getElementById(
        "jobLink"
    ).value = "";

    document.getElementById(
        "applicationModal"
    ).style.display =
    "flex";

}

// ======================================
// Close Modal
// ======================================

function closeModal() {

    document.getElementById(
        "applicationModal"
    ).style.display = "none";

}


// ======================================
// Save Button
// ======================================

document
    .getElementById(
        "saveApplicationBtn"
    )
    .addEventListener(
        "click",
        saveApplication
    );

document
    .getElementById(
        "cancelApplicationBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


// ======================================
// Save Application
// ======================================

async function saveApplication() {

    const id =
        document.getElementById(
            "applicationId"
        ).value;

    const statusSelect =
        document.getElementById(
            "applicationStatus"
        ).value;

    const statusOther =
        document.getElementById(
            "applicationStatusOther"
        ).value.trim();

    const application = {

        company_name:
            document.getElementById(
                "companyName"
            ).value.trim(),

        job_role:
            document.getElementById(
                "jobRole"
            ).value.trim(),

        status:
            statusSelect === "Other"
                ? statusOther
                : statusSelect,

        job_link:
            document.getElementById(
                "jobLink"
            ).value.trim()

    };

    if (statusSelect === "Other" && statusOther === "") {

        showToast(
            "Please enter a custom status.",
            "warning"
        );

        return;

    }

    if (application.company_name === "") {

        showToast(
            "Please enter company name.",
            "warning"
        );

        return;

    }

    if (application.job_role === "") {

        showToast(
            "Please enter job role.",
            "warning"
        );

        return;

    }

    if (application.status === "") {

        showToast(
            "Please select or enter a status.",
            "warning"
        );

        return;

    }

    try {

        let response;

        if (id === "") {

            response =
                await createApplication(
                    application
                );

        }

        else {

            response =
                await updateApplication(
                    id,
                    application
                );

        }

        const data =
            await response.json();

        if (!response.ok) {

            showToast(
                data.detail ||
                "Unable to save application.",
                "error"
            );

            return;

        }

        showToast(

            id === ""

                ? "Application added successfully!"

                : "Application updated successfully!",

            "success"

        );

        closeModal();

        await loadApplications();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Server Error.",
            "error"
        );

    }

}


// ======================================
// Edit Application
// ======================================

function editApplication(id) {

    const application =
        applications.find(

            app => app.id === id

        );

    if (!application) {

        showToast(
            "Application not found.",
            "error"
        );

        return;

    }

    document.getElementById(
        "modalTitle"
    ).innerText =
    "Edit Application";

    document.getElementById(
        "applicationId"
    ).value =
    application.id;

    document.getElementById(
        "companyName"
    ).value =
    application.company_name;

    document.getElementById(
        "jobRole"
    ).value =
    application.job_role;

    const presetStatuses =
        ["Applied", "Assessment", "Interview", "Offer", "Rejected"];

    const statusSelect =
        document.getElementById(
            "applicationStatus"
        );

    const statusOther =
        document.getElementById(
            "applicationStatusOther"
        );

    if (presetStatuses.includes(application.status)) {

        statusSelect.value = application.status;

        statusOther.style.display = "none";

        statusOther.value = "";

    }

    else {

        statusSelect.value = "Other";

        statusOther.style.display = "block";

        statusOther.value = application.status || "";

    }

    document.getElementById(
        "jobLink"
    ).value =
    application.job_link || "";

    document.getElementById(
        "applicationModal"
    ).style.display =
    "flex";

}


// ======================================
// Delete
// ======================================

async function deleteApplicationById(id) {

    const confirmed =
        await showConfirm(
            "Delete this application? This action cannot be undone."
        );

    if (!confirmed) {

        return;

    }

    try {

        const response =
            await deleteApplication(
                id
            );

        const data =
            await response.json();

        if (!response.ok) {

            showToast(

                data.detail ||

                "Unable to delete application.",

                "error"

            );

            return;

        }

        showToast(

            "Application deleted successfully!",

            "success"

        );

        applications =
            applications.filter(

                app => app.id !== id

            );

        updateStatistics();

        displayApplications(
            applications
        );

    }

    catch (err) {

        console.error(err);

        showToast(
            "Server Error.",
            "error"
        );

    }

}


// ======================================
// Close Modal on Outside Click
// ======================================

window.onclick = function(event) {

    const modal =
        document.getElementById(
            "applicationModal"
        );

    if (event.target === modal) {

        closeModal();

    }

};