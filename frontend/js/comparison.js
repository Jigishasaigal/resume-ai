const compareBtn =
    document.getElementById(
        "compareBtn"
    );

compareBtn.addEventListener(
    "click",
    compareResume
);


// =====================================
// Compare Resume
// =====================================

async function compareResume() {

    const file1 =
        document
        .getElementById("resume1")
        .files[0];

    const file2 =
        document
        .getElementById("resume2")
        .files[0];

    const jobDescription =
        document
        .getElementById("jobDescription")
        .value
        .trim();

    if (!file1) {

        showToast(
            "Please upload Resume 1.",
            "warning"
        );

        return;

    }

    if (!file2) {

        showToast(
            "Please upload Resume 2.",
            "warning"
        );

        return;

    }

    if (!file1.name.endsWith(".pdf")) {

        showToast(
            "Resume 1 must be a PDF.",
            "warning"
        );

        return;

    }

    if (!file2.name.endsWith(".pdf")) {

        showToast(
            "Resume 2 must be a PDF.",
            "warning"
        );

        return;

    }

    if (file1.name === file2.name) {

        showToast(
            "Please select two different resumes.",
            "warning"
        );

        return;

    }

    if (jobDescription === "") {

        showToast(
            "Please enter the Job Description.",
            "warning"
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "resume1",
        file1
    );

    formData.append(
        "resume2",
        file2
    );

    formData.append(
        "job_description",
        jobDescription
    );

    compareBtn.disabled = true;

    compareBtn.innerText =
        "Comparing...";

    try {

        const response =
            await compareResumes(
                formData
            );

        const data =
            await response.json();

        compareBtn.disabled = false;

        compareBtn.innerText =
            "Compare";

        if (!response.ok) {

            showToast(
                data.detail ||
                "Comparison failed.",
                "error"
            );

            return;

        }

        showComparison(data);

        showToast(
            "Comparison completed successfully!",
            "success"
        );

    }

    catch (err) {

        console.error(err);

        compareBtn.disabled = false;

        compareBtn.innerText =
            "Compare";

        showToast(
            "Unable to connect to the server.",
            "error"
        );

    }

}


// =====================================
// Display Result
// =====================================

function showComparison(data) {

    const result =
        document.getElementById(
            "result"
        );

    result.style.display =
        "block";

    result.innerHTML = `

        <h2>

            Comparison Result

        </h2>

        <hr>

        <h3>

            Resume 1 Score :

            ${data.resume1_score}%

        </h3>

        <h3>

            Resume 2 Score :

            ${data.resume2_score}%

        </h3>

        <h2>

            🏆 Winner :

            ${data.winner}

        </h2>

        <hr>

        <h3>

            Common Skills

        </h3>

        <ul>

            ${data.common_skills
                .map(skill =>
                    `<li>${skill}</li>`
                )
                .join("")
            }

        </ul>

        <h3>

            Resume 1 Unique Skills

        </h3>

        <ul>

            ${data.unique_resume1
                .map(skill =>
                    `<li>${skill}</li>`
                )
                .join("")
            }

        </ul>

        <h3>

            Resume 2 Unique Skills

        </h3>

        <ul>

            ${data.unique_resume2
                .map(skill =>
                    `<li>${skill}</li>`
                )
                .join("")
            }

        </ul>

        <h3>

            Feedback

        </h3>

        <ul>

            ${data.feedback
                .map(item =>
                    `<li>${item}</li>`
                )
                .join("")
            }

        </ul>

    `;

}