import re


def projects_score(resume_text):

    resume = resume_text.lower()

    count = len(
        re.findall(
            r"\b(project|projects)\b",
            resume
        )
    )

    if count >= 3:
        return 100

    if count == 2:
        return 80

    if count == 1:
        return 60

    return 0