import re
import requests
from bs4 import BeautifulSoup


def camel_case_split(str):
    return re.findall(r'[A-Z](?:[a-z]+|[A-Z]*(?=[A-Z]|$))', str)


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
