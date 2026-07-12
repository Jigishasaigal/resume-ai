def comparison_feedback(result):

    feedback = []

    if result["winner"] == "Resume 1":

        feedback.append(
            "Resume 1 is better aligned with the job description."
        )

    elif result["winner"] == "Resume 2":

        feedback.append(
            "Resume 2 is better aligned with the job description."
        )

    else:

        feedback.append(
            "Both resumes perform equally well."
        )

    if result["unique_resume1"]:

        feedback.append(
            "Resume 1 contains additional skills: "
            + ", ".join(result["unique_resume1"])
        )

    if result["unique_resume2"]:

        feedback.append(
            "Resume 2 contains additional skills: "
            + ", ".join(result["unique_resume2"])
        )

    return feedback
