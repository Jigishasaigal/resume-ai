from analysis.ats import calculate_ats_score


def compare_resumes(
    resume1_text,
    resume2_text,
    jd_text
):

    result1 = calculate_ats_score(
        resume1_text,
        jd_text
    )

    result2 = calculate_ats_score(
        resume2_text,
        jd_text
    )

    skills1 = set(result1["resume_skills"])
    skills2 = set(result2["resume_skills"])

    common_skills = sorted(
        skills1.intersection(skills2)
    )

    unique_resume1 = sorted(
        skills1.difference(skills2)
    )

    unique_resume2 = sorted(
        skills2.difference(skills1)
    )

    if result1["ats_score"] > result2["ats_score"]:

        winner = "Resume 1"

    elif result2["ats_score"] > result1["ats_score"]:

        winner = "Resume 2"

    else:

        winner = "Tie"

    return {

        "resume1_score":
            result1["ats_score"],

        "resume2_score":
            result2["ats_score"],

        "common_skills":
            common_skills,

        "unique_resume1":
            unique_resume1,

        "unique_resume2":
            unique_resume2,

        "winner":
            winner
    }
