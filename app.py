import random
import pandas as pd
from flask import Flask, jsonify
from flask import request, render_template, url_for, redirect
from scripts.utils import *
from scripts.github_pins import *


UPLOAD_DIR = 'static/data/'

app = Flask(__name__)


@app.route("/")
def home():
    global context
    context['name'] = 'home'
    return render_template(
        'index.html',
        name=context['name'],
        repos=context['repos'],
        typewriter=context['typewriter'],
        choice=random.choice
    )


@app.route("/certificates")
def certificates():
    global context
    context['name'] = 'certificates'
    return render_template(
        'certificates.html',
        name=context['name'],
        intern_certs=context['intern_certs'],
        college_certs=context['college_certs'],
        course_certs=context['course_certs'],
        typewriter=context['typewriter'],
        choice=random.choice
    )


@app.route("/research")
def research():
    global context
    context['name'] = 'research'
    return render_template(
        'research.html',
        name=context['name'],
        papers=context['papers'],
        typewriter=context['typewriter'],
        choice=random.choice
    )


@app.route("/resume")
def resume():
    global context
    context['name'] = 'resume'
    return render_template(
        'resume.html',
        name=context['name'],
        typewriter=context['typewriter'],
        choice=random.choice
    )


def get_repos():
    """
    Get list of repositories from github.

    Returns:
        list: List of repositories.
    """
    content = scrape_github("ikathuria")

    for i in content:
        if '.' in i['repo']:
            i['repo'] = " ".join(i['repo'].split('.'))

        elif '-' in i['repo']:
            i['repo'] = " ".join(i['repo'].split('-'))

        elif '_' in i['repo']:
            i['repo'] = " ".join(i['repo'].split('_'))

        else:
            i['repo'] = " ".join(camel_case_split(i['repo']))
    return content


def get_json_data(path):
    """
    Get list of research papers from json file.

    Returns:
        list: List of research papers.
    """
    content = pd.read_json(path, convert_dates=False).to_dict(orient='records')
    return content


context = {
    'name': 'home'
}

context['repos'] = get_repos()
context['papers'] = get_json_data('static/data/research_papers.json')

context['intern_certs'] = get_json_data(
    'static/data/internship_certificates.json'
)
context['college_certs'] = get_json_data(
    'static/data/college_certificates.json'
)
context['course_certs'] = get_json_data(
    'static/data/course_certificates.json'
)

context['typewriter'] = [
    "Humans are the only animals that blush.",
    "The moon has moonquakes.",
    "Kids ask 300 questions a day.",
    "Don't have kids.",
    "The human body literally glows.",
    "The first computer was invented in the 1940s.",
    "The unicorn is the national animal of Scotland.",
    "Rabbits can't puke.",
]



if __name__ == "__main__":
    app.run()
