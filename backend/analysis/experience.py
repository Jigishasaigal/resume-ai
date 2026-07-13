import re


def extract_experience_years(text: str):

    text = text.lower()

    pattern = r"(\d+)\+?\s*(years|year|yrs|yr)"

    matches = re.findall(pattern, text)

    if matches:
        return int(matches[0][0])

    return 0


def count_project_mentions(resume_text):


    text = resume_text.lower()

    return len(re.findall(r"\bproject(s)?\b", text))


def experience_score(resume_text, jd_text):

    resume_years = extract_experience_years(resume_text)

    jd_years = extract_experience_years(jd_text)

    if jd_years == 0:

        return 100, "not_required"

    if resume_years >= jd_years:

        return 100, "stated"

    if resume_years > 0:

        return (

            round((resume_years / jd_years) * 100, 2),

            "stated"

        )


    project_count = count_project_mentions(resume_text)

    if project_count == 0:

        return 0, "none"

    if jd_years <= 2:


        credit = min(project_count * 20, 70)

    else:


        credit = min(project_count * 10, 40)

    return round(credit, 2), "project_based"