document.addEventListener(
    "DOMContentLoaded",
    initializePage
);

const analyzeBtn =
    document.getElementById(
        "analyzeBtn"
    );

const createGroupBtn =
    document.getElementById(
        "createGroupBtn"
    );

analyzeBtn.addEventListener(
    "click",
    uploadResumeVersion
);

createGroupBtn.addEventListener(
    "click",
    createGroup
);


// ==============================
// Initialize
// ==============================

async function initializePage() {

    if (!getToken()) {

        window.location.href =
            "login.html";

        return;

    }

    await loadResumeGroups();

}


// ==============================
// Load Resume Groups
// ==============================

async function loadResumeGroups() {

    try {

        const response =
            await getResumeGroups();

        if (!response.ok) {

            showToast(
                "Unable to load Resume Groups.",
                "error"
            );

            return;

        }

        const groups =
            await response.json();

        const select =
            document.getElementById(
                "groupSelect"
            );

        select.innerHTML = "";

        if (groups.length === 0) {

            select.innerHTML =

                `<option value="">

                    No Resume Groups

                </option>`;

            return;

        }

        groups.forEach(group => {

            select.innerHTML += `

                <option value="${group.id}">

                    ${group.title}

                </option>

            `;

        });

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to load Resume Groups.",
            "error"
        );

    }

}


// ==============================
// Create Resume Group
// ==============================

async function createGroup() {

    const title =
        await showPrompt(
            "Enter Resume Group Name"
        );

    if (!title || title.trim() === "") {

        return;

    }

    try {

        const response =
            await createResumeGroup({

                title: title.trim()

            });

        const result =
            await response.json();

        if (!response.ok) {

            showToast(
                result.detail ||
                "Unable to create Resume Group.",
                "error"
            );

            return;

        }

        showToast(
            "Resume Group Created Successfully.",
            "success"
        );

        await loadResumeGroups();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to create Resume Group.",
            "error"
        );

    }

}


// ==============================
// Upload Resume Version
// ==============================

async function uploadResumeVersion() {

    const groupId =
        document.getElementById(
            "groupSelect"
        ).value;

    const resume =
        document.getElementById(
            "resumeFile"
        ).files[0];

    const jd =
        document.getElementById(
            "jobDescription"
        ).value.trim();

    if (groupId === "") {

        showToast(
            "Please select a Resume Group.",
            "warning"
        );

        return;

    }

    if (!resume) {

        showToast(
            "Please choose a PDF Resume.",
            "warning"
        );

        return;

    }

    if (jd === "") {

        showToast(
            "Please enter the Job Description.",
            "warning"
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "resume",
        resume
    );

    formData.append(
        "job_description",
        jd
    );

    const versionName =
        document.getElementById(
            "versionName"
        ).value.trim();

    if (versionName !== "") {

        formData.append(
            "version_name",
            versionName
        );

    }

    analyzeBtn.disabled = true;

    analyzeBtn.innerText =
        "Analyzing...";

    try {

        const response =
            await uploadResume(
                groupId,
                formData
            );

        const version =
            await response.json();

        analyzeBtn.disabled = false;

        analyzeBtn.innerText =
            "Analyze & Save Version";

        if (!response.ok) {

            showToast(
                version.detail ||
                "Unable to upload resume.",
                "error"
            );

            return;

        }

        showResult(version);

        showToast(

            "Resume uploaded successfully! Version " +

            version.version_number +

            " created.",

            "success"

        );

        document.getElementById(
            "resumeFile"
        ).value = "";

        document.getElementById(
            "versionName"
        ).value = "";

    }

    catch (err) {

        console.error(err);

        analyzeBtn.disabled = false;

        analyzeBtn.innerText =
            "Analyze & Save Version";

        showToast(
            "Unable to connect to the server.",
            "error"
        );

    }

}


// ==============================
// Show Result
// ==============================

function showResult(version) {

    document
        .getElementById(
            "resultCard"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "atsScore"
        )
        .innerText =
        version.ats_score + "%";

    applyScoreColor("atsScore", version.ats_score);

    let breakdown = null;

    if (version.score_breakdown) {

        try {

            breakdown =
                JSON.parse(version.score_breakdown);

        }

        catch (err) {

            console.error(err);

        }

    }

    renderScoreBreakdown(
        "scoreBreakdown",
        breakdown
    );

    const matched =
        document.getElementById(
            "matchedSkills"
        );

    const requiredMissing =
        document.getElementById(
            "requiredMissingSkills"
        );

    const optionalMissing =
        document.getElementById(
            "optionalMissingSkills"
        );

    const suggestions =
        document.getElementById(
            "suggestions"
        );

    matched.innerHTML = "";

    requiredMissing.innerHTML = "";

    optionalMissing.innerHTML = "";

    suggestions.innerHTML = "";

    if (version.matched_skills) {

        version
            .matched_skills
            .split(",")

            .filter(skill => skill.trim() !== "")

            .forEach(skill => {

                matched.innerHTML +=

                    `<li>${skill}</li>`;

            });

    }

    if (version.required_missing_skills) {

        version
            .required_missing_skills
            .split(",")

            .filter(skill => skill.trim() !== "")

            .forEach(skill => {

                requiredMissing.innerHTML +=

                    `<li>${skill}</li>`;

            });

    }

    else {

        requiredMissing.innerHTML =
            "<li>None</li>";

    }

    if (version.optional_missing_skills) {

        version
            .optional_missing_skills
            .split(",")

            .filter(skill => skill.trim() !== "")

            .forEach(skill => {

                optionalMissing.innerHTML +=

                    `<li>${skill}</li>`;

            });

    }

    else {

        optionalMissing.innerHTML =
            "<li>None</li>";

    }

    if (version.suggestions) {

        version
            .suggestions
            .split("\n")

            .filter(item => item.trim() !== "")

            .forEach(item => {

                suggestions.innerHTML +=

                    `<li>${item}</li>`;

            });

    }

}