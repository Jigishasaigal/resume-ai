document.addEventListener(
    "DOMContentLoaded",
    loadReport
);


async function loadReport() {

    if (!getToken()) {

        window.location.href =
            "login.html";

        return;

    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const analysisId =
        params.get("id");

    if (!analysisId) {

        showToast("Invalid report.", "error");

        window.location.href =
            "dashboard.html";

        return;

    }

    loadResumePreview(analysisId);

    try {

        const response =
            await getResumeReport(
                analysisId
            );

        if (!response.ok) {

            showToast("Report not found.", "error");

            window.location.href =
                "dashboard.html";

            return;

        }

        const report =
            await response.json();

        displayReport(report);

    }

    catch (err) {

        console.error(err);

        showToast(
            "Unable to load report.",
            "error"
        );

    }

}


function displayReport(report) {

    document
        .getElementById("atsScore")
        .innerText =
        report.ats_score + "%";

    applyScoreColor("atsScore", report.ats_score);

    renderScoreBreakdown(
        "scoreBreakdown",
        report.breakdown
    );

    displayList(

        "matchedSkills",

        report.matched_skills,

        ","

    );

    displayList(

        "requiredMissingSkills",

        report.required_missing_skills,

        ","

    );

    displayList(

        "optionalMissingSkills",

        report.optional_missing_skills,

        ","

    );

    displayList(

        "suggestions",

        report.suggestions,

        "\n"

    );

}


function displayList(

    elementId,

    value,

    separator

) {

    const list =
        document.getElementById(
            elementId
        );

    list.innerHTML = "";

    let items = [];

    if (Array.isArray(value)) {

        items = value;

    }

    else if (typeof value === "string") {

        items = value.split(separator);

    }

    items = items

        .map(item => String(item).trim())

        .filter(item => item !== "");

    if (items.length === 0) {

        list.innerHTML =
            "<li>None</li>";

        return;

    }

    items.forEach(item => {

        list.innerHTML +=
            `<li>${item}</li>`;

    });

}


// =====================================
// Original Resume Preview
// =====================================

async function loadResumePreview(analysisId) {

    const status =
        document.getElementById(
            "previewStatus"
        );

    const preview =
        document.getElementById(
            "resumePreview"
        );

    try {

        const response =
            await getResumeFile(
                analysisId
            );

        if (!response.ok) {

            status.innerText =
                "Unable to load resume preview.";

            return;

        }

        const blob =
            await response.blob();

        const fileUrl =
            URL.createObjectURL(blob);

        preview.src = fileUrl;

        preview.style.display = "block";

        status.style.display = "none";

    }

    catch (err) {

        console.error(err);

        status.innerText =
            "Unable to load resume preview.";

    }

}

// =====================================
// ATS Score Color
// =====================================

function applyScoreColor(elementId, score) {

    const element =
        document.getElementById(elementId);

    if (!element) {

        return;

    }

    if (score >= 80) {

        element.style.color = "#22c55e";

    }

    else if (score >= 60) {

        element.style.color = "#f59e0b";

    }

    else {

        element.style.color = "#ef4444";

    }

}

// =====================================
// Score Breakdown
// =====================================

function renderScoreBreakdown(containerId, breakdown) {

    const container =
        document.getElementById(containerId);

    if (!container) {

        return;

    }

    if (!breakdown) {

        container.innerHTML =
            "<p>No score breakdown available.</p>";

        return;

    }

    container.innerHTML = `

        <div class="score-item">

            <span>Skills Match</span>

            <strong>${breakdown.skills ?? 0}%</strong>

        </div>

        <div class="score-item">

            <span>Experience</span>

            <strong>${breakdown.experience ?? 0}%</strong>

        </div>

        <div class="score-item">

            <span>Education</span>

            <strong>${breakdown.education ?? 0}%</strong>

        </div>

        <div class="score-item">

            <span>Projects</span>

            <strong>${breakdown.projects ?? 0}%</strong>

        </div>

    `;

}