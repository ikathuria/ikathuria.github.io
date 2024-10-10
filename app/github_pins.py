from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import pandas as pd

from app.constants import *
from app.utils import *


options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("enable-automation")
# options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")


class GetPinnedGithubRepos():

    def __init__(self, user):
        self.username = user
        self.github_link = f""
        self.repo_image_link = f""

    def set_repo_context(self, context):
        try:
            context["repos"] = self.get_repos()
        except Exception as e:
            LOGGER.error(
                f"Failed to get repos from scraping because of error: {e}.")
            LOGGER.info("Falling back to static data.")
            context["repos"] = get_json_data(path="static/data/repos.json")

        context["papers"] = get_json_data("RESEARCH_PAPERS")
        context["intern_certs"] = get_json_data("INTERNSHIP_CERTIFICATES")
        context["course_certs"] = get_json_data("COURSE_CERTIFICATES")
        context["college_certs"] = get_json_data("COLLEGE_CERTIFICATES")
        context["typewriter"] = [
            "Humans are the only animals that blush.",
            "The moon has moonquakes.",
            "Kids ask 300 questions a day.",
            "Don't have kids.",
            "The human body literally glows.",
            "The first computer was invented in the 1940s.",
            "The unicorn is the national animal of Scotland.",
            "Rabbits can't puke.",
        ]

        return context

    def get_repos(self):
        """
        Get list of repositories from github.

        Returns:
            list: List of repositories.
        """
        content = self.scrape_github()

        for i in content:
            if "." in i["repo"]:
                i["repo"] = " ".join(i["repo"].split("."))

            elif "-" in i["repo"]:
                i["repo"] = " ".join(i["repo"].split("-"))

            elif "_" in i["repo"]:
                i["repo"] = " ".join(i["repo"].split("_"))

            else:
                i["repo"] = " ".join(camel_case_split(i["repo"]))

        pd.DataFrame(content).to_json("static/data/repos.json", "records")
        return content

    def scrape_github(self, username):
        """Scraping github for pinned repos.

        Args:
            username (str): Github username.

        Returns:
            data (list): list with dicts of details of pinned repos.
        """
        global DRIVER

        data = []
        DRIVER = webdriver.Chrome(
            options=options
        )

        try:
            path = GITHUB_LINK.format(username, "")
            DRIVER.get(path)
            DRIVER.set_page_load_timeout(5)

            # getting all pinned repos
            pins = DRIVER.find_elements(
                By.CLASS_NAME, "pinned-item-list-item-content"
            )

            # scraping details for each pinned repo
            for pin in pins:
                data.append(self.get_repo(username, pin))

            for i in range(len(data)):
                data[i]["website"], data[i]["image"] = self.get_website_image(
                    data[i]["owner"], data[i]["repo"], data[i]["link"]
                )

        except:
            pass

        DRIVER.quit()

        return data

    def get_website_image(self, repo, link):
        """Scraping website and image for each repo.

        Args:
            repo (str): Github repo name.
            link (str): Github repo link.

        Returns:
            web (str): Github repo website.
            image (str): Github repo image.
        """
        web = ""
        image = GITHUB_REPO_IMAGE.format(self.username, repo)

        try:
            DRIVER.get(link)

            # website associated with repo
            about = DRIVER.find_element(By.CLASS_NAME, "BorderGrid-cell")
            web = about.find_element(By.TAG_NAME, "a")
            if "Topic" not in web.get_attribute("title"):
                web = web.get_attribute("href")

            # image added to repo
            image = DRIVER.find_element(
                By.NAME, "twitter:image:src"
            ).get_attribute("content")

        except Exception as e:
            LOGGER.error(f"Failed to get repo image because of error: {e}.")

        return web, image

    def get_repo(self, pin):
        """Scraping details for each pinned repo.

        Args:
            pin (WebElement): Pinned repo.

        Returns:
            repo (dict): Repo details.
        """
        try:
            # owner of repo
            owner = self.username
            owner = pin.find_element(By.CLASS_NAME, "owner").text

            # repo name
            repo = pin.find_element(By.CLASS_NAME, "repo").text

            # link to repo
            link = ""
            link = GITHUB_LINK.format(owner, repo)

            # description of repo
            description = ""
            description = pin.find_element(
                By.CLASS_NAME, "pinned-item-desc").text

            # main language of repo
            language = ""
            language = pin.find_element(
                By.CSS_SELECTOR, "span[itemprop='programmingLanguage']"
            ).text

            # language colour of repo
            languageColor = ""
            languageColor = pin.find_element(
                By.CLASS_NAME, "repo-language-color"
            ).get_attribute("style")
            languageColor = languageColor.replace("background-color: ", "")
            languageColor = languageColor.replace(";", "")

        except Exception as e:
            LOGGER.error(
                f"Failed to scrape repo information because of error: {e}.")
            return {}

        # number of stars and forks of repo
        meta = pin.find_elements(
            By.CLASS_NAME, "pinned-item-meta"
        )

        stars = 0
        stars = int(meta[0].text)
        forks = 0
        forks = int(meta[1].text)

        result = {
            "owner": owner,
            "repo": repo,
            "link": link,
            "description": description,
            "image": "",
            "website": "",
            "language": language,
            "languageColor": languageColor,
            "stars": stars,
            "forks": forks,
        }

        return result
