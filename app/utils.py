import re
import json
import logging
import requests
from bs4 import BeautifulSoup


class PortfolioLogger:
    def __init__(self):
        pass

    def setup_logging(self):
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(asctime)s %(name)s [%(levelname)s] %(message)s",
            handlers=[
                logging.FileHandler("service.log"),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger()


LOGGER = PortfolioLogger().setup_logging()


def camel_case_split(str):
    return re.findall(r"[A-Z](?:[a-z]+|[A-Z]*(?=[A-Z]|$))", str)


def get_user_info():
    link = "https://api.github.com/users/ikathuria"
    content = requests.get(link).json()
    return content


def get_stats():
    link = "https://github-readme-stats.vercel.app/api/?username=ikathuria"
    content = BeautifulSoup(requests.get(link).content, "lxml").find_all(
        "text", {"class": "stat"}
    )
    text = [i.get_text() for i in content]
    commits = int(text[3])
    contribute = int(text[9])

    return [commits, contribute]


def sort_files(lis):
    lis.sort(key=lambda x: x.split(".")[0])
    return lis


def get_json_data(key="", path="static/data/user_data.json"):
    """
    Get list of research papers from json file.

    Returns:
        list: List of research papers.
    """
    with open(path, "r") as file:
        data = json.load(file)
    if key != "":
        return data[key]
    return data
