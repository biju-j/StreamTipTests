# author biju-j on 09/11/2018

import pytest

from BaseTest import BaseTest

# Test Suite extending from Base Class having field locators, messages


class TestStreams(BaseTest):
    # Initial setup method
    @pytest.fixture(scope="function", autouse=True)
    def setup(self):
        self.driver.get(self.baseurl)
        assert self.pagetitle in self.driver.title

    # Validate labels only
    def test_login_page_labels(self):
        assert self.userlabel in self.driver.find_element_by_css_selector(self.username).text
        assert self.passwordlabel in self.driver.find_element_by_css_selector(self.password).text

    # Validate Username, Password, Login button
    def test_login_page_fields(self):
        assert self.userdefaultvalue in self.driver.find_element_by_css_selector(self.userinputfield)\
            .get_attribute("placeholder")
        assert self.passworddeafultvalue in self.driver.find_element_by_css_selector(self.passwordinputfield)\
            .get_attribute("placeholder")
        assert self.loginname in self.driver.find_element_by_css_selector(self.loginbutton)\
            .get_attribute("value")

    # Validate Error with all fields empty
    def test_all_fieldsempty_loginclicked(self):
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        assert self.error in self.driver.find_element_by_css_selector(self.errorbox).text
        self.driver.find_element_by_css_selector(self.closebutton).click()

    # Validate Error with username and without Password
    def test_validuid_withoutpassword_loginclicked(self):
        element = self.driver.find_element_by_css_selector(self.userinputfield)
        element.clear()
        element.send_keys(self.uid)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        assert self.error in self.driver.find_element_by_css_selector(
            self.errorbox).text
        self.driver.find_element_by_css_selector(self.closebutton).click()
        element.clear()

    # Validate Error without username and with Password
    def test_emptyuid_validpassword_loginclicked(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(' ')
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        assert self.error in self.driver.find_element_by_css_selector(
            self.errorbox).text
        self.driver.find_element_by_css_selector(self.closebutton).click()
        pwd.clear()

    # Validate Successful Sign-in
    def test_valid_credentials_loginsuccess(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        logtext = self.driver.find_element_by_css_selector(self.logout).text
        elements = self.driver.find_elements_by_xpath(self.gifpageelements)
        self.driver.find_element_by_css_selector(self.logout).click()
        assert self.logofftext == logtext
        print(len(elements))
        assert len(elements) > 0,'Elements fetched'

    # Validate fetching all GIFs visible by default without any keyword entry or selection click
    def test_fetchall_default_gifs(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        allgifsize = self.driver.find_elements_by_css_selector(self.childgifs).count
        self.driver.find_element_by_css_selector(self.logout).click()
        print(allgifsize)
        assert allgifsize != 0

    # Validate Navigation to Tip amount entry page without selection of any GIFs
    def test_click_continue(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        # its continue button
        self.driver.find_element_by_xpath(self.continuebutton).click()
        elementssize = self.driver.find_elements_by_css_selector(self.tipcontainer).count
        self.driver.find_element_by_css_selector(self.logout).click()
        assert elementssize !=0

    # Validate Tips amount Entry page
    def test_click_continue_check_tips(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        self.driver.find_element_by_xpath(self.continuebutton).click()
        header = self.driver.find_element_by_tag_name(self.tipheaderone).text
        self.driver.find_element_by_css_selector(self.logout).click()
        assert self.tipheader in header

    # Validate Tips amout page fields like buttons
    def test_click_continue_directly_check_tip_page(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        self.driver.find_element_by_xpath(self.continuebutton).click()
        buttoncount = self.driver.find_elements_by_css_selector(self.tipbuttons).count
        self.driver.find_element_by_css_selector(self.logout).click()
        assert buttoncount != 1

    # Validate selection of a GIF and Continue to Tip amount entry page
    def test_select_randomly_one_gig_thentotippage(self):
        uid = self.driver.find_element_by_css_selector(self.userinputfield)
        uid.clear()
        uid.send_keys(self.uid)
        pwd = self.driver.find_element_by_css_selector(self.passwordinputfield)
        pwd.clear()
        pwd.send_keys(self.pwd)
        self.driver.find_element_by_css_selector(self.loginbutton).click()
        self.driver.find_element_by_xpath(self.onegifselection).click()
        self.driver.find_element_by_xpath(self.continuebutton).click()
        header = self.driver.find_element_by_tag_name("h1").text
        self.driver.find_element_by_css_selector(self.logout).click()
        assert self.tipheader in header