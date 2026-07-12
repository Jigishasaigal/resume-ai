import re


def keyword_density_score(resume_text, jd_text):

    # Clean both texts the same way. Previously resume_words only used
    # .split(), so "Python," or "SQL." (with trailing punctuation) never
    # matched the punctuation-stripped jd_words, undercounting overlap.
    resume_words = set(
        re.findall(r"[a-zA-Z+#.]+", resume_text.lower())
    )

    jd_words = set(
        re.findall(r"[a-zA-Z+#.]+", jd_text.lower())
    )

    if len(jd_words) == 0:
        return 0

    matched = len(
        jd_words.intersection(resume_words)
    )

    return round(
        (matched / len(jd_words)) * 100,
        2
    )