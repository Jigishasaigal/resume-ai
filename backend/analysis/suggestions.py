def generate_suggestions(result):

    breakdown = result.get("breakdown", {})

    required_missing = result.get("required_missing_skills", [])

    optional_missing = result.get("optional_missing_skills", [])

    skills_score = breakdown.get("skills", 0)

    experience_score = breakdown.get("experience", 0)

    education_score = breakdown.get("education", 0)

    projects_score = breakdown.get("projects", 0)

    keyword_score = breakdown.get("keyword_density", 0)

    suggestions = []

    if required_missing:

        suggestions.append(

            "These required skills are missing from your resume: "

            + ", ".join(required_missing[:5])

            + ". Add them if you have hands-on experience with them."

        )

    elif skills_score < 70 and optional_missing:

        suggestions.append(

            "Consider adding these preferred (optional) skills if you "

            "have experience with them: "

            + ", ".join(optional_missing[:5])

            + "."

        )

    if experience_score < 70:

        suggestions.append(

            "State your years of experience explicitly (e.g. '3 years of "

            "experience in...') so it can be matched against what this "

            "role requires."

        )

    if education_score == 0:

        suggestions.append(

            "This job description expects a specific degree that isn't "

            "clearly stated on your resume. Make sure your degree and "

            "branch appear near the top."

        )

    if projects_score < 80:

        suggestions.append(

            "Add more detail to your project section — resumes with 3 or "

            "more clearly described projects score noticeably higher here."

        )

    if keyword_score < 50:

        suggestions.append(

            "Reuse more of the exact wording from the job description "

            "throughout your resume, not just in the skills list — this "

            "affects keyword matching independently of your skills score."

        )

    if not suggestions:

        suggestions.append(

            "Excellent! Your resume closely matches this job description "

            "across skills, experience, education, and keyword usage."

        )

    return suggestions