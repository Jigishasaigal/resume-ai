EDUCATION = [
    "b.tech",
    "btech",
    "be",
    "b.e",
    "m.tech",
    "mtech",
    "mca",
    "bca",
    "msc",
    "bsc"
]


def education_score(resume_text, jd_text):

    resume = resume_text.lower()
    jd = jd_text.lower()

    for degree in EDUCATION:

        if degree in jd and degree in resume:
            return 100

    if any(degree in resume for degree in EDUCATION):
        return 70

    return 0