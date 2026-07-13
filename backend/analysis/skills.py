import re

SKILLS = {

    "java": ["java"],
    "python": ["python"],
    "c": ["c programming"],
    "c++": ["c++"],
    "c#": ["c#", "c sharp"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],

    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "bootstrap": ["bootstrap"],
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],

    "react": ["react", "react.js", "reactjs"],
    "angular": ["angular", "angular.js", "angularjs"],
    "vue": ["vue", "vue.js", "vuejs"],
    "node.js": ["node.js", "nodejs", "node js"],
    "express": ["express", "express.js", "expressjs"],

    "spring": ["spring framework"],
    "spring boot": ["spring boot", "springboot"],
    "spring security": ["spring security"],
    "hibernate": ["hibernate"],

    "fastapi": ["fastapi", "fast api"],
    "flask": ["flask"],
    "django": ["django"],

    "rest api": ["rest api", "restful api", "rest apis", "restful", "rest endpoints"],
    "microservices": ["microservices", "micro services", "microservice"],

    "mysql": ["mysql"],
    "postgresql": ["postgresql", "postgres"],
    "mongodb": ["mongodb", "mongo"],
    "sqlite": ["sqlite"],
    "oracle": ["oracle db", "oracle database"],
    "redis": ["redis"],
    "sql": ["sql"],

    "git": ["git"],
    "github": ["github", "git hub"],

    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud", "google cloud platform"],
    "linux": ["linux"],

    "ci/cd": ["ci/cd", "ci cd", "continuous integration", "continuous deployment"],
    "jenkins": ["jenkins"],
    "kafka": ["kafka"],
    "maven": ["maven"],
    "junit": ["junit"],
    "jwt": ["jwt", "json web token", "json web tokens"],

    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch"],
    "opencv": ["opencv"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "scikit-learn": ["scikit-learn", "scikit learn", "sklearn"],

    "data structures": ["data structures", "dsa"],
    "algorithms": ["algorithms", "dsa"],
    "object-oriented programming": [
        "object-oriented programming",
        "object oriented programming",
        "oop"
    ],

}


def clean_text(text: str):

    text = text.lower()


    text = re.sub(r"[^a-z0-9+#.\-\s]", " ", text)

    return text


def extract_skills(text: str):

    text = clean_text(text)

    found_skills = set()

    for canonical, aliases in SKILLS.items():

        for alias in aliases:

            alias_normalized = alias.lower()

            pattern = (

                r"(?<![a-z0-9+#.\-])"

                + re.escape(alias_normalized)

                + r"(?![a-z0-9+#.\-])"

            )

            if re.search(pattern, text):

                found_skills.add(canonical)

                break

    return sorted(found_skills)