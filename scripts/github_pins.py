import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument('--log-level=1')
options.add_argument("enable-automation")
options.add_argument("--disable-infobars")
options.add_argument("--disable-dev-shm-usage")
# options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")


def get_website_image(owner, repo, link):
    """Scraping website and image for each repo.

    Args:
        owner (str): Github username.
        repo (str): Github repo name.
        link (str): Github repo link.

    Returns:
        web (str): Github repo website.
        image (str): Github repo image.
    """
    DRIVER.get(link)

    # website associated with repo
    try:
        about = DRIVER.find_element(By.CLASS_NAME, "BorderGrid-cell")
        web = about.find_element(By.TAG_NAME, "a")
        if "Topic" not in web.get_attribute("title"):
            web = web.get_attribute("href")
        else:
            web = ""
    except:
        web = ""

    # image added to repo
    try:
        image = DRIVER.find_element(
            By.NAME, "twitter:image:src"
        ).get_attribute("content")
    except:
        image = f"https://opengraph.githubassets.com/1/{owner}/{repo}"

    return web, image


def get_repo(username, pin):
    """Scraping details for each pinned repo.

    Args:
        username (str): Github username.
        pin (WebElement): Pinned repo.

    Returns:
        repo (dict): Repo details.
    """

    # owner of repo
    try:
        owner = pin.find_element(By.CLASS_NAME, "owner").text
    except:
        owner = username

    # repo name
    try:
        repo = pin.find_element(By.CLASS_NAME, "repo").text
    except:
        return {}

    # link to repo
    try:
        link = f"https://github.com/{owner}/{repo}"
    except:
        link = ""

    # description of repo
    try:
        description = pin.find_element(By.CLASS_NAME, "pinned-item-desc").text
    except:
        description = ""

    # main language of repo
    try:
        language = pin.find_element(
            By.CSS_SELECTOR, "span[itemprop='programmingLanguage']"
        ).text
    except:
        language = ""

    # language colour of repo
    try:
        languageColor = pin.find_element(
            By.CLASS_NAME, "repo-language-color"
        ).get_attribute("style")
        languageColor = languageColor.replace("background-color: ", "")
        languageColor = languageColor.replace(";", "")
    except:
        languageColor = ""

    # number of stars and forks of repo
    meta = pin.find_elements(
        By.CLASS_NAME, "pinned-item-meta"
    )

    try:
        stars = int(meta[0].text)
    except:
        stars = 0

    try:
        forks = int(meta[1].text)
    except:
        forks = 0

    result = {
        'owner': owner,
        'repo': repo,
        'link': link,
        'description': description,
        'image': '',
        'website': '',
        'language': language,
        'languageColor': languageColor,
        'stars': stars,
        'forks': forks,
    }

    return result


def scrape_github(username):
    """Scraping github for pinned repos.

    Args:
        username (str): Github username.

    Returns:
        data (list): list with dicts of details of pinned repos.
    """
    global DRIVER

    data = []
    # DRIVER = webdriver.Chrome(
    #     os.environ.get("CHROMEDRIVER_PATH"), options=options
    # )

    DRIVER = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    try:
        path = f"https://www.github.com/{username}"
        DRIVER.get(path)
        DRIVER.set_page_load_timeout(5)

        # getting all pinned repos
        pins = DRIVER.find_elements(
            By.CLASS_NAME, "pinned-item-list-item-content"
        )

        # scraping details for each pinned repo
        for pin in pins:
            data.append(get_repo(username, pin))

        for i in range(len(data)):
            data[i]['website'], data[i]['image'] = get_website_image(
                data[i]['owner'], data[i]['repo'], data[i]['link']
            )

    except:
        pass

    DRIVER.quit()

    return data
