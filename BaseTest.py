import string

import pytest as pytest
from random import randint
# Base class with fixture of driver instance returned


@pytest.mark.usefixtures("browser")
class BaseTest:
    baseurl = "http://localhost:8080/"
    error = "Warning! Incorrect username or password"
    pagetitle = "qa_test_v1"
    userlabel = "Your username"
    username = "label[for='username']"
    passwordlabel = "Your password"
    password = "label[for='password']"
    userinputfield = "input[type='text']"
    userdefaultvalue = "admin"
    passwordinputfield = "input[type='password']"
    passworddeafultvalue = "Enter your password"
    loginname = "Login"
    loginbutton = "input[type='submit']"
    errorbox = "div.error-box"
    closebutton = "a.button.button-primary"
    uid = "admin"
    pwd = "password"
    gifpageelements = "//div[@class='home']/div[2]/div"
    childgifs = "div.gifs"
    searchheaderone = "//div[@class='home']/div[2]/div/h1"
    searchfield = "//div[@class='home']/div[2]/div/input"
    searchabutton = "//div[@class='home']/div[2]/div/a"
    searchheaderoneval = "Search for a gif"
    searchheadertwo = ""
    searchbutton = "a.search-btn"
    logout = "a.button.button-primary"
    logofftext = "LOGOUT"
    tipheader = "Enter a tip amount (min $1)"
    tipinput = "input#type"
    backbutton = "Back"
    submit = "Submit"
    continuebutton = "//div[@class='margin-top--60px']/a"
    tipcontainer = "div.container"
    tiphone = "div[@class='container']/h1"
    tipbuttons = "div.margin-top--20px"
    index = "string"
    # For randomly picking the GIFs b/w 1 to 10
    index = str(randint(1, 10))
    onegifselection = "//div[@id='app']/div/div[2]/div/div["+index+"]"
    tipheaderone = "h1"
    pass




