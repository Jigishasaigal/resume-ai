import re

from analysis.skills import extract_skills, SKILLS
from analysis.experience import experience_score
from analysis.education import education_score
from analysis.projects import projects_score
from analysis.keywords import keyword_density_score


def find_alternative_groups(jd_text):


    text = jd_text.lower()

    alias_to_canonical = {}

    for canonical, aliases in SKILLS.items():

        for alias in aliases:

            alias_to_canonical[alias.lower()] = canonical

    sorted_aliases = sorted(

        alias_to_canonical.keys(), key=len, reverse=True

    )

    skill_pattern = "|".join(

        re.escape(alias) for alias in sorted_aliases

    )

    token_regex = re.compile(

        r"(?<![a-z0-9+#.\-])(" + skill_pattern + r")(?![a-z0-9+#.\-])"

    )

    groups = []

    for line in text.split("\n"):

        matches = list(token_regex.finditer(line))

        if len(matches) < 2:

            continue

        current_group = [

            alias_to_canonical[matches[0].group(1)]

        ]

        for prev_match, curr_match in zip(matches, matches[1:]):

            between = line[prev_match.end():curr_match.start()]

            if re.fullmatch(r"[\s,/]*(or|and/or)?[\s,/]*", between):

                current_group.append(

                    alias_to_canonical[curr_match.group(1)]

                )

            else:

                if len(current_group) > 1:

                    groups.append(set(current_group))

                current_group = [

                    alias_to_canonical[curr_match.group(1)]

                ]

        if len(current_group) > 1:

            groups.append(set(current_group))

    return groups


def split_required_optional(jd_text):


    lines = jd_text.split("\n")

    required_header = re.compile(

        r"^\s*(required skills?|requirements?|must[\s-]?have|"

        r"core skills?|mandatory skills?)\s*:?\s*$",

        re.IGNORECASE

    )

    optional_header = re.compile(

        r"^\s*(preferred skills?|nice[\s-]?to[\s-]?have|"

        r"good[\s-]?to[\s-]?have|optional skills?|bonus( points)?|"

        r"desirable skills?|plus)\s*:?\s*$",

        re.IGNORECASE

    )

    required_lines = []

    optional_lines = []

    current_bucket = required_lines

    found_optional_header = False

    for line in lines:

        stripped = line.strip()

        if optional_header.match(stripped):

            current_bucket = optional_lines

            found_optional_header = True

            continue

        if required_header.match(stripped):

            current_bucket = required_lines

            continue

        current_bucket.append(line)

    required_text = "\n".join(required_lines)

    optional_text = (

        "\n".join(optional_lines)

        if found_optional_header

        else ""

    )

    return required_text, optional_text


def _score_section(resume_skills, section_text):


    section_skills = set(

        extract_skills(section_text)

    )

    alt_groups = find_alternative_groups(section_text)

    grouped_skills = set()

    for group in alt_groups:

        grouped_skills |= group

    standalone_skills = section_skills - grouped_skills

    matched_standalone = resume_skills.intersection(

        standalone_skills

    )

    missing_standalone = standalone_skills.difference(

        resume_skills

    )

    satisfied_groups = []

    unsatisfied_groups = []

    for group in alt_groups:

        if resume_skills.intersection(group):

            satisfied_groups.append(group)

        else:

            unsatisfied_groups.append(group)

    total = len(standalone_skills) + len(alt_groups)

    satisfied = len(matched_standalone) + len(satisfied_groups)

    matched = sorted(

        matched_standalone

        |

        {

            skill

            for group in satisfied_groups

            for skill in group

            if skill in resume_skills

        }

    )

    missing = sorted(

        missing_standalone

        |

        {

            skill

            for group in unsatisfied_groups

            for skill in group

        }

    )

    return {

        "matched": matched,

        "missing": missing,

        "total": total,

        "satisfied": satisfied

    }


def calculate_ats_score(resume_text, jd_text):

    resume_skills = set(

        extract_skills(resume_text)

    )

    jd_skills = set(

        extract_skills(jd_text)

    )

    required_text, optional_text = split_required_optional(

        jd_text

    )

    required_result = _score_section(

        resume_skills, required_text

    )

    has_optional_section = optional_text.strip() != ""

    if has_optional_section:

        optional_result = _score_section(

            resume_skills, optional_text

        )


        optional_result["missing"] = sorted(

            set(optional_result["missing"])

            -

            set(required_result["missing"])

        )

    else:

        optional_result = {

            "matched": [],

            "missing": [],

            "total": 0,

            "satisfied": 0

        }

    if required_result["total"] == 0:

        required_ratio = 0

    else:

        required_ratio = (

            required_result["satisfied"]

            /

            required_result["total"]

        )

    if has_optional_section and optional_result["total"] > 0:

        optional_ratio = (

            optional_result["satisfied"]

            /

            optional_result["total"]

        )


        skills = (

            required_ratio * 0.8

            +

            optional_ratio * 0.2

        ) * 100

    else:


        skills = required_ratio * 100

    matched_skills = sorted(

        set(required_result["matched"])

        |

        set(optional_result["matched"])

    )

    missing_skills = sorted(

        set(required_result["missing"])

        |

        set(optional_result["missing"])

    )

    experience, experience_basis = experience_score(

        resume_text,

        jd_text

    )

    education = education_score(

        resume_text,

        jd_text

    )

    projects = projects_score(

        resume_text

    )

    keywords = keyword_density_score(

        resume_text,

        jd_text

    )

    final_score = (

        skills * 0.50 +

        experience * 0.20 +

        education * 0.10 +

        projects * 0.10 +

        keywords * 0.10

    )

    return {

        "ats_score": int(round(final_score)),

        "breakdown": {

            "skills": int(round(skills)),

            "experience": int(round(experience)),

            "experience_basis": experience_basis,

            "education": int(round(education)),

            "projects": int(round(projects)),

            "keyword_density": int(round(keywords))

        },

        "resume_skills": sorted(
            resume_skills
        ),

        "jd_skills": sorted(
            jd_skills
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "required_matched_skills": required_result["matched"],

        "required_missing_skills": required_result["missing"],

        "optional_matched_skills": optional_result["matched"],

        "optional_missing_skills": optional_result["missing"]

    }