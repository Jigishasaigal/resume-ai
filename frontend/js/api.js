const API_URL = "https://resume-ai-backend-v7l8.onrender.com";


// ======================================
// Token
// ======================================

function saveToken(token){

    localStorage.setItem(
        "token",
        token
    );

}

function getToken(){

    return localStorage.getItem(
        "token"
    );

}

function removeToken(){

    localStorage.removeItem(
        "token"
    );

}

function logout(){

    removeToken();

    window.location.href =
        "login.html";

}


// ======================================
// Generic Requests
// ======================================

async function apiGet(endpoint){

    return await fetch(

        API_URL + endpoint,

        {

            headers:{

                Authorization:
                "Bearer " + getToken()

            }

        }

    );

}


async function apiPost(endpoint,body){

    return await fetch(

        API_URL + endpoint,

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json",

                Authorization:
                "Bearer " + getToken()

            },

            body:JSON.stringify(body)

        }

    );

}


async function apiPut(endpoint,body){

    return await fetch(

        API_URL + endpoint,

        {

            method:"PUT",

            headers:{

                "Content-Type":
                "application/json",

                Authorization:
                "Bearer " + getToken()

            },

            body:JSON.stringify(body)

        }

    );

}


async function apiDelete(endpoint){

    return await fetch(

        API_URL + endpoint,

        {

            method:"DELETE",

            headers:{

                Authorization:
                "Bearer " + getToken()

            }

        }

    );

}


async function apiPostForm(endpoint,formData){

    return await fetch(

        API_URL + endpoint,

        {

            method:"POST",

            headers:{

                Authorization:
                "Bearer " + getToken()

            },

            body:formData

        }

    );

}



// ======================================
// Authentication
// ======================================

async function getCurrentUser(){

    return await apiGet(
        "/auth/me"
    );

}



// ======================================
// Resume Groups
// ======================================

async function getResumeGroups(){

    return await apiGet(
        "/resume/groups"
    );

}


async function createResumeGroup(body){

    return await apiPost(

        "/resume/groups",

        body

    );

}


async function updateResumeGroup(id,body){

    return await apiPut(

        "/resume/groups/" + id,

        body

    );

}


async function deleteResumeGroup(id){

    return await apiDelete(

        "/resume/groups/" + id

    );

}



// ======================================
// Resume Versions
// ======================================

async function getResumeVersions(groupId){

    return await apiGet(

        "/resume/groups/" +

        groupId +

        "/versions"

    );

}


async function uploadResume(

    groupId,

    formData

){

    return await apiPostForm(

        "/resume/groups/" +

        groupId +

        "/versions",

        formData

    );

}


async function getResumeVersion(id){

    return await apiGet(

        "/resume/versions/" +

        id

    );

}


async function getResumeReport(id){

    return await apiGet(

        "/resume/versions/" +

        id +

        "/report"

    );

}


function downloadResume(id){

    window.open(

        API_URL +

        "/resume/versions/" +

        id +

        "/download"

    );

}


async function deleteResumeVersion(id){

    return await apiDelete(

        "/resume/versions/" +

        id

    );

}



// ======================================
// Resume Comparison
// ======================================

async function compareResumes(formData){

    return await apiPostForm(

        "/comparison",

        formData

    );

}



// ======================================
// Applications
// ======================================

async function getApplications(){

    return await apiGet(

        "/applications"

    );

}


async function createApplication(body){

    return await apiPost(

        "/applications",

        body

    );

}


async function updateApplication(

    id,

    body

){

    return await apiPut(

        "/applications/" +

        id,

        body

    );

}


async function deleteApplication(id){

    return await apiDelete(

        "/applications/" +

        id

    );

}

// ======================================
// Confirm Modal
// ======================================

function showConfirm(message) {

    return new Promise((resolve) => {

        const oldModal =
            document.querySelector(".confirm-overlay");

        if (oldModal) {

            oldModal.remove();

        }

        const overlay =
            document.createElement("div");

        overlay.className = "confirm-overlay";

        overlay.innerHTML = `

            <div class="confirm-box">

                <p class="confirm-message"></p>

                <div class="confirm-actions">

                    <button class="btn btn-secondary" id="confirmCancelBtn">

                        Cancel

                    </button>

                    <button class="btn btn-danger" id="confirmOkBtn">

                        Delete

                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(overlay);

        overlay.querySelector(
            ".confirm-message"
        ).innerText = message;

        setTimeout(() => {

            overlay.classList.add("show");

        }, 10);

        function close(result) {

            overlay.classList.remove("show");

            setTimeout(() => {

                overlay.remove();

            }, 200);

            resolve(result);

        }

        overlay
            .querySelector("#confirmOkBtn")
            .addEventListener("click", () => close(true));

        overlay
            .querySelector("#confirmCancelBtn")
            .addEventListener("click", () => close(false));

        overlay.addEventListener("click", (event) => {

            if (event.target === overlay) {

                close(false);

            }

        });

    });

}


// ======================================
// Resume File (for inline preview)
// ======================================

async function getResumeFile(id){

    return await apiGet(

        "/resume/versions/" + id + "/download"

    );

}

// ======================================
// Toast Notification
// ======================================

function showToast(message, type = "info") {

    const oldToast = document.querySelector(".toast");

    if (oldToast) {

        oldToast.remove();

    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}


// ======================================
// Prompt Modal
// ======================================

function showPrompt(message, defaultValue = "") {

    return new Promise((resolve) => {

        const oldModal =
            document.querySelector(".confirm-overlay");

        if (oldModal) {

            oldModal.remove();

        }

        const overlay =
            document.createElement("div");

        overlay.className = "confirm-overlay";

        overlay.innerHTML = `

            <div class="confirm-box">

                <p class="confirm-message"></p>

                <input
                    type="text"
                    id="promptInput"
                    class="prompt-input">

                <div class="confirm-actions">

                    <button class="btn btn-secondary" id="promptCancelBtn">

                        Cancel

                    </button>

                    <button class="btn btn-primary" id="promptOkBtn">

                        OK

                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(overlay);

        overlay.querySelector(
            ".confirm-message"
        ).innerText = message;

        const input =
            overlay.querySelector("#promptInput");

        input.value = defaultValue;

        setTimeout(() => {

            overlay.classList.add("show");

            input.focus();

        }, 10);

        function close(result) {

            overlay.classList.remove("show");

            setTimeout(() => {

                overlay.remove();

            }, 200);

            resolve(result);

        }

        overlay
            .querySelector("#promptOkBtn")
            .addEventListener("click", () => {

                close(input.value.trim());

            });

        overlay
            .querySelector("#promptCancelBtn")
            .addEventListener("click", () => close(null));

        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                close(input.value.trim());

            }

            if (event.key === "Escape") {

                close(null);

            }

        });

        overlay.addEventListener("click", (event) => {

            if (event.target === overlay) {

                close(null);

            }

        });

    });

}


// ======================================
// Score Breakdown Display
// ======================================

function renderScoreBreakdown(containerId, breakdown) {

    const container =
        document.getElementById(containerId);

    if (!container) {

        return;

    }

    if (!breakdown) {

        container.innerHTML =
            "<p class=\"breakdown-empty\">Score breakdown not available for this version.</p>";

        return;

    }

    const labels = {

        skills: "Skills Match",

        experience: "Experience",

        education: "Education",

        projects: "Projects",

        keyword_density: "Keyword Density"

    };

    const experienceCaptions = {

        stated: null,

        not_required: "Not required for this role",

        project_based: "Estimated from project experience — no formal work history stated",

        none: "No years of experience or project details detected"

    };

    container.innerHTML = "";

    Object.keys(labels).forEach(key => {

        const value =
            breakdown[key] !== undefined
                ? breakdown[key]
                : 0;

        let caption = "";

        if (

            key === "experience" &&

            breakdown.experience_basis &&

            experienceCaptions[breakdown.experience_basis]

        ) {

            caption = `

                <div class="breakdown-caption">

                    ${experienceCaptions[breakdown.experience_basis]}

                </div>

            `;

        }

        container.innerHTML += `

            <div class="breakdown-row">

                <div class="breakdown-label">

                    <span>${labels[key]}</span>

                    <span>${value}%</span>

                </div>

                <div class="breakdown-bar">

                    <div
                        class="breakdown-fill"
                        style="width:${value}%">

                    </div>

                </div>

                ${caption}

            </div>

        `;

    });

}


// ======================================
// Score Color Coding
// ======================================

function applyScoreColor(elementId, score) {

    const el = document.getElementById(elementId);

    if (!el) {

        return;

    }

    el.classList.remove(

        "score-low",

        "score-mid",

        "score-high"

    );

    if (score < 40) {

        el.classList.add("score-low");

    }

    else if (score < 70) {

        el.classList.add("score-mid");

    }

    else {

        el.classList.add("score-high");

    }

}