'use strict';

require('async');
let pro = require('protractor');
let env = require( './../config/env.json');
let all = require( './../resources/data.json');

let fetch = all.data;

let chai = require('chai');
let expect = chai.expect;
let Support = require("./../utils/support.js");
let logger = require('./../config/config-log4js.js');
let EC = pro.ExpectedConditions;
let driver = browser.driver;
let login =function (uid, pwd)
{
    driver.findElement(By.css(fetch['userinputfield'])).sendKeys(uid);
    driver.findElement(By.xpath(fetch['passwordinputfield'])).sendKeys(pwd);
    driver.findElement(By.css(fetch['loginbutton'])).click();
}

let logout = function()
{   let signoff = driver.findElement(By.xpath("//div[@id='app']/div/div[1]/div/div[1]"));
    driver.executeScript("arguments[0].click()",signoff);
}


describe('Stream Tips TestSuite', function () {
    let thisSuite = this;
    thisSuite.support = new Support();

    beforeEach(function () {

        browser.waitForAngularEnabled(false);
        driver.get(env.host['url']);

        /* browser.wait(function() {

            browser.ignoreSynchronization = true;
            return $('#auto-refresh').isPresent();
        });*/

    });


    it('Initial Launch', function () {
        logger.info(`Initial Launch test `);
        expect(driver.getTitle(), 'qa_test_1');
    });

    it('Fetch login page labels', function () {
        let usrlabel = driver.findElement(By.css(fetch['username'])).getText();
        let pwdlabel = driver.findElement(By.css(fetch['password'])).getText();
        logout();
        expect(fetch['userlabel'], usrlabel);
        expect(fetch['passwordlabel', pwdlabel]);
    });


    it('Fetch login page fields', function () {
        let uidfield = driver.findElement(By.css(fetch['userinputfield'])).getText();
        let pwsfield = driver.findElement(By.xpath(fetch['passwordinputfield'])).getText();
        let loginbuttontext = driver.findElement(By.css(fetch['loginbutton'])).getText();
        logout();
        expect(fetch['userdefaultvalue'], uidfield);
        expect(fetch['passworddeafultvalue'], pwsfield);
        expect(fetch['loginname'], loginbuttontext);
    });

    it('Empty fields submitted error', function () {

        login('', '');
        let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();

        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'], checkmsg);
    });

    it('Valid username entered with Password empty', function () {

        login(fetch['uid'], '');
        let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();
        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'], checkmsg);
    });

    it('Valid Password entered with Username Empty ', function () {
        //driver.findElement(By.css(fetch['passwordinputfield'])).sendKeys(fetch['pwd']);
        // driver.findElement(By.css(fetch['loginbutton'])).click();
        login('', fetch['pwd']);
        let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();
        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'], checkmsg);

    });

    it('Valid Credentials - Signin Success', function () {

        login(fetch['uid'], fetch['pwd']);
        let searchheader = driver.findElement(By.xpath(fetch['searchheaderone'])).getText();
        driver.findElement(By.xpath(fetch['logofftext'])).click();
        let usrlabel = driver.findElement(By.css(fetch['username'])).getText();
        let pwdlabel = driver.findElement(By.css(fetch['password'])).getText();
        logout();
        expect(fetch['userlabel'], usrlabel);
        expect(fetch['passwordlabel', pwdlabel]);
        expect(fetch['searchheaderoneval'], searchheader);
    });

    it('Fetch all default GIFs without search by keyword/click selection', function () {

        login(fetch['uid'], fetch['pwd']);
        element.all(by.className(fetch['childgifs'])).then(function (items) {
            expect(items.length, 10);
        });

        driver.findElement(By.xpath(fetch['logofftext'])).click();
        logout();
    });


    /*
        Fixing Random selection issue
     */

    it('Click select one GIF randomly', async function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(element(by.xpath(fetch['searchheaderone'])).isDisplayed(), 15000);
        let gifindex = Math.floor(Math.random() * 14 + 1);
        let onegifrandom = fetch['getgif'] + gifindex + ")";
        logger.info("Gif selected is >>>" + onegifrandom);
        element.all(by.css(fetch['childgifs'])).each(function (element, index) {
            if (index == gifindex && element.isElementPresent()) {
                element.getWebElement().click();

            }
        });
        driver.findElement(By.xpath(fetch['logofftext'])).click();
    });

    it('Search by keyword and select a GIF randomly', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        let searchtext = driver.findElement(By.xpath(fetch['searchfield']));
        let val = fetch['searchval'];

        searchtext.sendKeys(val);


        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();
            // logger.info("Entered value : "+enteredvalue);
            expect(val, enteredvalue);
            if (enteredvalue == val) {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['firstchild'])).click();
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();

    });

    it('Search by keyword, select GIF and continue to Tip input page', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys(fetch['searchval']);
        // driver.wait(EC.textToBePresentInElement(driver.findElement(By.css(fetch['valinput'])), val), 5000);
        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == fetch['searchval']) {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['firstchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText();
                    logger.info("Tip HEADER : " + fetcheadtxt);
                    expect(fetch['tipheader'], fetcheadtxt);
                }
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();

    });


    it('Search by keyword, select GIF, continue to Tip input page Click SUBMIT', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys(fetch['searchval']);
        // driver.wait(EC.textToBePresentInElement(driver.findElement(By.css(fetch['valinput'])), val), 5000);
        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == fetch['searchval']) {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['firstchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText();
                    logger.info("Tip HEADER : " + fetcheadtxt);
                    if (driver.findElement(By.xpath(fetch['tipinput'])).isDisplayed()) {
                        expect(fetch['tipdefault'], driver.findElement(By.xpath(fetch['tipinput'])).getText());
                        element(by.xpath(fetch['submitbutton'])).isDisplayed();
                        element(by.xpath(fetch['backbutton'])).click();
                        driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                    }
                }
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();

    });


    it('Search by keyword, select GIF, continue to Tip input page Click BACK', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys(fetch['searchval']);
        // driver.wait(EC.textToBePresentInElement(driver.findElement(By.css(fetch['valinput'])), val), 5000);
        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == fetch['searchval']) {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['firstchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText()
                    logger.info("Tip HEADER : " + fetcheadtxt);
                    if (driver.findElement(By.xpath(fetch['tipinput'])).isDisplayed()) {
                        expect(fetch['tipdefault'], driver.findElement(By.xpath(fetch['tipinput'])).getText());
                        element(by.css(fetch['submitbutton'])).isDisplayed();
                        element(by.css(fetch['backbutton'])).click();

                        if (driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed())
                            expect(fetch['searchheaderoneval'], driver.findElement(By.xpath(fetch['searchheaderone'])).getText());
                    }
                }
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();

    });

    it('Search by keyword, select GIF, continue to Tip input page Click BACK select GIF', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys('test');

        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == 'test') {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['nthchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText()
                    logger.info("Tip HEADER : " + fetcheadtxt);
                    if (driver.findElement(By.xpath(fetch['tipinput'])).isDisplayed()) {
                        expect(fetch['tipdefault'], driver.findElement(By.xpath(fetch['tipinput'])).getText());
                        element(by.xpath(fetch['submitbutton'])).isDisplayed();
                        element(by.xpath(fetch['backbutton'])).click();

                        if (driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed()) {
                            expect(fetch['searchheaderoneval'], driver.findElement(By.xpath(fetch['searchheaderone'])).getText());
                            element(by.css(fetch['continuebutton'])).click();
                        }
                    }
                }
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();

    });

    // End-to-End Scenario with Tip 0
    it('Check invalid Tip 0 Submission', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys('test');

        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == 'test') {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['nthchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                driver.wait(tiphead.isDisplayed, 10000);
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText();

                    logger.info("Tip HEADER : " + fetcheadtxt);
                    if (driver.findElement(By.xpath(fetch['tipinput'])).isDisplayed()) {
                        driver.findElement(By.xpath(fetch['tipinput'])).sendKeys(fetch['zero']);

                        driver.findElement(By.xpath(fetch['submitbutton'])).isDisplayed();
                        driver.findElement(By.xpath(fetch['submitbutton'])).click();

                        driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                    }
                }
            }
        }
        driver.findElement(By.xpath(fetch['logofftext'])).click();
    });

    // End-to-End Scenario with Tip 1
    it('Check Tip 1 Submission', function () {

        login(fetch['uid'], fetch['pwd']);

        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.xpath(fetch['searchfield'])).sendKeys('books');


        driver.findElement(By.css(fetch['searchbutton'])).click();
        driver.wait(element(by.css(fetch['continuebutton'])).isDisplayed(), 20);
        let buttontext = element(by.css(fetch['continuebutton'])).getText();
        //logger.info("Button is>  "+buttontext);
        // driver.wait(driver.findElement(By.css(fetch['childgifs'])).isDisplayed(), 20000);
        element.all(by.css(fetch['childgifs'])).then(function (items) {
            expect(items.length, 10);
        });

        // driver.findElement(By.css(fetch['firstchild'])).click();
        driver.wait(driver.findElement(By.xpath(fetch['gifvi'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['gifvi'])).click();

        element(by.css(fetch['continuebutton'])).click();

        //driver.wait(element(by.css(fetch['tiphone'])).isDisplayed(), 30);
        driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['one']);

        element.all(by.css(fetch['buttons'])).each(function (element, index) {
            if (index == 2 && element.isDisplayed()) {
                logger.info("SUBMITTED");
                element.getWebElement().click();

            }
        });

        /*driver.executeScript("return $('.right a').click();").then(function(element){
           logger.info("Now...Logout"+element);
        });*/

        element.all(by.css(fetch['amountcard'])).then(function (elements) {
            expect(elements.length, 3);
        });

        logout();

    });
 });

