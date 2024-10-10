import random
from flask import Flask
from flask import render_template

from app.github_pins import GetPinnedGithubRepos
from app.constants import *
from app.utils import *

SCRAPER = GetPinnedGithubRepos("ikathuria")
CONTEXT = SCRAPER.set_repo_context(CONTEXT)
FLASK_APP = Flask(__name__)

@FLASK_APP.route("/")
def home():
    global CONTEXT
    CONTEXT["name"] = "home"
    return render_template(
        "index.html",
        name=CONTEXT["name"],
        repos=CONTEXT["repos"],
        papers=CONTEXT["papers"],
        intern_certs=CONTEXT["intern_certs"],
        college_certs=CONTEXT["college_certs"],
        course_certs=CONTEXT["course_certs"],
        typewriter=CONTEXT["typewriter"],
        choice=random.choice
    )


@FLASK_APP.route("/resume")
def resume():
    global CONTEXT
    CONTEXT["name"] = "resume"
    return render_template(
        "resume.html",
        name=CONTEXT["name"],
        typewriter=CONTEXT["typewriter"],
        choice=random.choice
    )


if __name__ == "__main__":
    FLASK_APP.config["TEMPLATES_AUTO_RELOAD"] = True
    FLASK_APP.run(host="0.0.0.0", port=8080)
