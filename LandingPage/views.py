from django.shortcuts import render
from django.contrib.staticfiles.storage import staticfiles_storage
import datetime
import json
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import random


def camel_case_split(str):
    return re.findall(r'[A-Z](?:[a-z]+|[A-Z]*(?=[A-Z]|$))', str)


def get_repos():
    link = 'https://gh-pinned-repos.egoist.sh/?username=ikathuria'
    content = requests.get(link).json()
    for i in content:
        i['repo'] = " ".join(camel_case_split(i['repo']))
    return content


def get_user_info():
    link = "https://api.github.com/users/ikathuria"
    content = requests.get(link).json()
    return content


def get_stats():
    link = "https://github-readme-stats.vercel.app/api/?username=ikathuria"
    content = BeautifulSoup(requests.get(link).content, 'lxml').find_all(
        'text', {'class': 'stat'}
    )
    text = [i.get_text() for i in content]
    commits = int(text[3])
    contribute = int(text[9])

    return [commits, contribute]


def index(request):
    context = {}

    time = datetime.datetime.now().strftime("%H:%M:%S")
    user_info_json = staticfiles_storage.path('data/user_info.json')

    if time == '00:00:00':
        new_user_data = pd.DataFrame.from_dict(get_user_info(), orient='index')
        new_user_data.to_json(user_info_json)

    with open(user_info_json) as f:
        user_data = json.load(f)

    context['repos'] = get_repos()

    context['user'] = user_data

    context['stats'] = get_stats()

    context['typewriter'] = random.choice([
        "Humans are the only animals that blush.",
        "The moon has moonquakes.",
        "Kids ask 300 questions a day.",
        "Don't have kids.",
        "The human body literally glows.",
        "The first computer was invented in the 1940s.",
        "The unicorn is the national animal of Scotland.",
        "Rabbits can't puke.",
    ])

    return render(request, 'index.html', context)
