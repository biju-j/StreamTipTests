import pytest
from selenium import webdriver

# File to read browser option from Command-line


def pytest_addoption(parser):
    parser.addoption("-B", "--browser", dest="browser", default="firefox",
                     help="Valid options are firefox or chrome")

# Method to return specified driver


@pytest.yield_fixture(scope="class", autouse=True)
def browser(request):
    browser = request.config.getoption("--browser")
    if browser == 'chrome':
        driver = webdriver.Chrome()
        driver.get("about:blank")
        driver.implicitly_wait(10)
        driver.maximize_window()
    elif browser == 'firefox':
        driver = webdriver.Firefox()
        driver.get("about:blank")
        driver.implicitly_wait(10)
        driver.maximize_window()
    request.cls.driver = driver
    yield
    driver.close()
    driver.quit()


