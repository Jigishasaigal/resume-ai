document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        logout
    );


async function loadDashboard(){

    if(!getToken()){

        window.location.href =
            "login.html";

        return;

    }

    await loadUser();

    await loadResumeGroups();

    await loadApplications();

}


// ============================
// User
// ============================

async function loadUser(){

    try{

        const response =
            await getCurrentUser();

        if(!response.ok){

            logout();

            return;

        }

        const user =
            await response.json();

        document
            .getElementById(
                "userName"
            )
            .textContent =
            user.name;

    }

    catch(err){

        console.error(err);

    }

}


// ============================
// Resume Groups
// ============================

async function loadResumeGroups(){

    try{

        const response =
            await getResumeGroups();

        if(!response.ok){

            return;

        }

        const groups =
            await response.json();

        const container =
            document.getElementById(
                "resumeGroups"
            );

        container.innerHTML = "";

        document
            .getElementById(
                "groupCount"
            )
            .textContent =
            groups.length;

        if(groups.length===0){

            container.innerHTML =

            `<div class="empty">

                No Resume Groups Yet.

            </div>`;

            return;

        }

        let totalVersions = 0;

        let totalATS = 0;

        let versionCounter = 0;

        for(const group of groups){

            container.innerHTML += `

            <div class="group-card">

                <h3>

                    ${group.title}

                </h3>

                <button
                    class="btn btn-primary"
                    onclick="openGroup(${group.id})">

                    View Versions

                </button>

            </div>

            `;

            const versionResponse =
                await getResumeVersions(
                    group.id
                );

            if(versionResponse.ok){

                const versions =
                    await versionResponse.json();

                totalVersions +=
                    versions.length;

                versions.forEach(v=>{

                    totalATS +=
                        v.ats_score;

                    versionCounter++;

                });

            }

        }

        document
            .getElementById(
                "versionCount"
            )
            .textContent =
            totalVersions;

        document
            .getElementById(
                "averageATS"
            )
            .textContent =

            versionCounter===0 ?

            "0%" :

            Math.round(
                totalATS /
                versionCounter
            ) + "%";

        await loadRecentVersions(
            groups
        );

    }

    catch(err){

        console.error(err);

    }

}


// ============================
// Recent Versions
// ============================

async function loadRecentVersions(groups){

    const history =
        document.getElementById(
            "history"
        );

    history.innerHTML="";

    let versions=[];

    for(const group of groups){

        const response =
            await getResumeVersions(
                group.id
            );

        if(response.ok){

            const data =
                await response.json();

            data.forEach(v=>{

                v.groupTitle =
                    group.title;

                versions.push(v);

            });

        }

    }

    versions.sort(

        (a,b)=>

        new Date(b.created_at)

        -

        new Date(a.created_at)

    );

    versions =
        versions.slice(0,5);

    if(versions.length===0){

        history.innerHTML =

        `<div class="empty">

            No Resume Versions Yet.

        </div>`;

        return;

    }

    versions.forEach(v=>{

        const label =
            v.version_name ||
            ("V" + v.version_number);

        history.innerHTML += `

        <div class="history-card">

            <div class="history-left">

                <h3>

                    ${v.groupTitle}

                    — ${label}

                </h3>

                <p>

                    ${new Date(

                        v.created_at

                    ).toLocaleString()}

                </p>

            </div>

            <div>

                <p class="score">

                    ${v.ats_score}%

                </p>

                <button
                    class="btn btn-success"
                    onclick="viewReport(${v.id})">

                    View Report

                </button>

            </div>

        </div>

        `;

    });

}


// ============================
// Applications
// ============================

async function loadApplications(){

    try{

        const response =
            await getApplications();

        if(!response.ok){

            return;

        }

        const apps =
            await response.json();

        document
            .getElementById(
                "applicationCount"
            )
            .textContent =
            apps.length;

    }

    catch(err){

        console.error(err);

    }

}


// ============================
// Navigation
// ============================

function openGroup(id){

    window.location.href =

        "versions.html?group="+id;

}

function viewReport(id){

    window.location.href =

        "report.html?id="+id;

}