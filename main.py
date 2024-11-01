import random
import pandas as pd

from flask import Flask
from flask import render_template

from app.github_pins import CreatePageContext
from app.constants import *
from app.utils import *

SCRAPER = CreatePageContext("ikathuria")
CONTEXT = SCRAPER.set_context(CONTEXT)
FLASK_APP = Flask(__name__)

projects = [
    {'id': 1, 'title': 'Region Build Automation', 'short_desc': 'Automating new region service launches.',
        'full_desc': 'Detailed info about Region Build Automation project...'},
    {'id': 2, 'title': 'OpenSearch Optimization', 'short_desc': 'Optimizing OpenSearch domains for AWS.',
        'full_desc': 'Detailed info about OpenSearch Optimization project...'}
]


@FLASK_APP.route("/")
def home():
    global CONTEXT
    CONTEXT["name"] = "home"
    return render_template(
        "index.html",
        repos=CONTEXT['repos'],
        papers=CONTEXT['papers'],
        intern_certs=CONTEXT['intern_certs'],
        college_certs=CONTEXT['college_certs'],
        course_certs=CONTEXT['course_certs'],
        typewriter=CONTEXT['typewriter'],
        choice=random.choice,
        enumerate=enumerate
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
