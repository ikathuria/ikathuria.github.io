import os
import re
import json
import random
import requests
import datetime
import pandas as pd
from bs4 import BeautifulSoup

from django.shortcuts import render
from django.contrib.staticfiles.storage import staticfiles_storage



def camel_case_split(str):
    return re.findall(r'[A-Z](?:[a-z]+|[A-Z]*(?=[A-Z]|$))', str)


def get_repos():
    link = 'https://ikathuria-web-scraping.herokuapp.com/github/ikathuria'
    content = requests.get(link).json()
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


def sort_files(lis):
    lis.sort(key=lambda x: x.split('.')[0])
    return lis


def index(request):
    global context
    context['name'] = 'home'
    return render(request, 'index.html', context)


def projects(request):
    global context
    context['name'] = 'projects'
    return render(request, 'projects.html', context)


def research(request):
    global context
    context['name'] = 'research'
    return render(request, 'research.html', context)


def resume(request):
    global context
    context['name'] = 'resume'
    return render(request, 'resume.html', context)



# CONTEXT ################################################################################################################3
context = {
    'name': 'home'
}

context['repos'] = get_repos()

# user_info_json = staticfiles_storage.path('data/user_info.json')

# time = datetime.datetime.now().strftime("%H:%M:%S")
# if time == '00:00:00':
#     new_user_data = pd.DataFrame.from_dict(get_user_info(), orient='index')
#     new_user_data.to_json(user_info_json)

# with open(user_info_json) as f:
#     user_data = json.load(f)

# context['user'] = user_data

# context['intern_certs'] = [i for i in os.listdir(
#     staticfiles_storage.path('data/certificates/internships')
# ) if i.count('.') == 1]

# context['intern_certs'].sort(
#     key=lambda var: [int(x) if x.isdigit()
#                      else x for x in re.findall(r'[^0-9]|[0-9]+', var)],
#     reverse=True
# )

# context['course_certs'] = [i for i in os.listdir(
#     staticfiles_storage.path('data/certificates/courses')
# ) if i.count('.') == 1]

# context['course_certs'].sort(
#     key=lambda var: [int(x) if x.isdigit()
#                      else x for x in re.findall(r'[^0-9]|[0-9]+', var)],
#     reverse=True
# )

# context['college_certs'] = [i for i in os.listdir(
#     staticfiles_storage.path('data/certificates/college')
# ) if i.count('.') == 1]

# context['college_certs'].sort(
#     key=lambda var: [int(x) if x.isdigit()
#                      else x for x in re.findall(r'[^0-9]|[0-9]+', var)],
#     reverse=True
# )

# context['stats'] = get_stats()

# context['typewriter'] = random.choice([
#     "Humans are the only animals that blush.",
#     "The moon has moonquakes.",
#     "Kids ask 300 questions a day.",
#     "Don't have kids.",
#     "The human body literally glows.",
#     "The first computer was invented in the 1940s.",
#     "The unicorn is the national animal of Scotland.",
#     "Rabbits can't puke.",
# ])
