document.addEventListener(
    "DOMContentLoaded",
    loadVersions
);

async function loadVersions(){

    if(!getToken()){

        window.location.href="login.html";

        return;

    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const groupId =
        params.get("group");

    if(!groupId){

        alert("Invalid Resume Group.");

        return;

    }

    try{

        const response =
            await getResumeVersions(
                groupId
            );

        const versions =
            await response.json();

        displayVersions(
            versions
        );

    }

    catch(err){

        console.error(err);

        alert(
            "Unable to load versions."
        );

    }

}


function displayVersions(versions){

    const list =
        document.getElementById(
            "versionsList"
        );

    list.innerHTML="";

    if(versions.length===0){

        list.innerHTML=

        "<h3>No Versions Found.</h3>";

        return;

    }

    versions.forEach(version=>{

        list.innerHTML+=`

        <div class="card">

            <h2>

                ${version.version_name || ("Version " + version.version_number)}

            </h2>

            <p>

                ATS Score :

                ${version.ats_score}%

            </p>

            <p>

                ${new Date(
                    version.created_at
                ).toLocaleString()}

            </p>

            <button
            onclick="viewReport(${version.id})">

                View Report

            </button>

            <button
            onclick="deleteVersion(${version.id})">

                Delete

            </button>

        </div>

        `;

    });

}


function viewReport(id){

    window.location.href=

    "report.html?id="+id;

}


async function deleteVersion(id){

    const confirmed =
        await showConfirm(
            "Delete this resume version? This action cannot be undone."
        );

    if(!confirmed){

        return;

    }

    const response=
        await deleteResumeVersion(id);

    const data=
        await response.json();

    showToast(data.message, "success");

    setTimeout(() => {

        location.reload();

    }, 800);

}