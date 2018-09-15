'use strict';

require('async');
let pro = require('protractor');
let env = require( './../config/env.json');
let all = require( './../resources/data.json');
let fs = require('fs');
let fetch = all.data;

let chai = require('chai');
let expect = chai.expect;
let Support = require("./../utils/support.js");
let logger = require('./../config/config-log4js.js');
let EC = pro.ExpectedConditions;
let driver = browser.driver;

/**
 * Loging method
 * @param uid
 * @param pwd
 */

function login(uid, pwd)
{   element.all(by.tagName("input")).each(function(field,index){
            // logger.info("index "+index);
            if(index == 0){
                field.getWebElement().sendKeys(uid);
            }
            else if(index == 1){
                field.getWebElement().sendKeys(pwd);
            }
            else if(index == 2){
                field.getWebElement().click();
            }
     });

}

/**
 * Logout method
 */
function logout()
{   let signoff = driver.findElement(By.xpath(fetch['signoff']));
    driver.executeScript("arguments[0].click()",signoff);
}

/**
 * ScreenShot captured Saver utility
 * @param data
 * @param filename
 */
function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

/**
 * JavaSctipt executor method
 * @param elem
 */
function runjs(elem){
    driver.executeScript("arguments[0].click()",elem);
    driver.sleep(1000);

}

/**
 * Screen capture wrapper method
 * @param name
 */
function capture(name){
    driver.takeScreenshot().then(function(png){
        writeScreenShot(png, "./screenshots/"+name+".png");
    });
}

/**
 * Repeat or do it again reusable method
 */
function doitagain(){
        driver.sleep(9000);
        if(driver.findElement(By.xpath(fetch['signoff'])).isDisplayed()){

                element.all(by.xpath(fetch['gifpageelements'])).each(function(header, index){
                    logger.info("Index in doitagain "+index);

                        logger.info("Header: "+header.getWebElement().getText());

                });
                driver.findElement(By.css(fetch['searchfield'])).sendKeys('cars');


                let searchbutton = driver.findElement(By.css(fetch['searchbutton']));
                runjs(searchbutton);
                //driver.wait(element(by.css(fetch['continuebutton'])).isDisplayed(), 30);


                element.all(by.css(fetch['allgifs'])).each(function (item, index) {
                    driver.sleep(9000);

                    capture("allgifs");

                    if (index == 0) {
                        item.getWebElement().click();
                        // logger.info("Selected a gif");
                        capture("onegif");
                    }

                });

                element(by.css(fetch['continuebutton'])).click();
                capture("continueclick");


                if (element(by.css(fetch['tiphone'])).isDisplayed()) {
                    // logger.info("About to give tip");
                    /*driver.takeScreenshot().then(function(png){
                        writeScreenShot(png, "tippage.png");
                    });*/
                    driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['three']);

                    element.all(by.css(fetch['buttons'])).each(function (button, index) {
                        // logger.info("Fetch buttons" + index);
                        if (index == 1) {

                            runjs(button.getWebElement());
                            // logger.info("Gave a tip of " + fetch['three']);
                            capture("tipsubmit" + fetch['three']);

                        }
                    });

                }
                element.all(by.css(fetch['amountcard'])).each(function (element, index) {
                    // Will print 0 First, 1 Second, 2 Third.
                    capture("finalcard");
                    element.getText().then(function (text) {
                        // logger.info(index, text);
                        if (index == 0) {
                            logout();
                        }
                    });
                });

        }

}

/**
 * Test Suite of unit tests for different scenarios
 */
describe('Stream Tips TestSuite', function () {
    let thisSuite = this;
    thisSuite.support = new Support();

    beforeEach(function () {

        browser.waitForAngularEnabled(false);
        driver.get(env.host['url']);

    });


    it('Initial Launch', function () {
        // logger.info(`Initial Launch test `);
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


    it('Click select one GIF randomly', async function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(element(by.xpath(fetch['searchheaderone'])).isDisplayed(), 15000);
        let gifindex = Math.floor(Math.random() * 14 + 1);
        let onegifrandom = fetch['getgif'] + gifindex + ")";
        // logger.info("Gif selected is >>>" + onegifrandom);
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
        let searchtext = driver.findElement(By.css(fetch['searchfield']));
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
        driver.findElement(By.css(fetch['searchfield'])).sendKeys(fetch['searchval']);
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
                    // logger.info("Tip HEADER : " + fetcheadtxt);
                    expect(fetch['tipheader'], fetcheadtxt);
                }
            }
        }
        logout();

    });

    // End-to-End Scenario with Tip 0
    it('Check invalid Tip 0 Submission', function () {

        login(fetch['uid'], fetch['pwd']);
        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.css(fetch['searchfield'])).sendKeys('test');

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

                    // logger.info("Tip HEADER : " + fetcheadtxt);
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


 });

/**
 * Search GIF select scenarios
 */
describe("Search GIF scenarios ", function(){

    beforeEach(function () {

        browser.waitForAngularEnabled(false);
        driver.get(env.host['url']);

        login(fetch['uid'], fetch['pwd']);
    });

    it('Search by keyword, select GIF, continue to Tip input page Click SUBMIT', function () {

        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.css(fetch['searchfield'])).sendKeys(fetch['searchval']);
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
                    // logger.info("Tip HEADER : " + fetcheadtxt);
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

        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.css(fetch['searchfield'])).sendKeys(fetch['searchval']);
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
                    // logger.info("Tip HEADER : " + fetcheadtxt);
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

        driver.wait(driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed(), 20);
        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        driver.findElement(By.css(fetch['searchfield'])).sendKeys('test');

        if (driver.findElement(By.css(fetch['valinput'])).isDisplayed()) {
            let enteredvalue = driver.findElement(By.css(fetch['valinput'])).getText();

            if (enteredvalue == 'test') {

                driver.findElement(By.css(fetch['searchbutton'])).click();
                driver.findElement(By.css(fetch['nthchild'])).click();
                element(by.css(fetch['continuebutton'])).click();

                let tiphead = driver.findElement(By.css(fetch['tipheaderone'])).$('h1');
                if (tiphead.isDisplayed()) {
                    let fetcheadtxt = tiphead.getText()
                    // logger.info("Tip HEADER : " + fetcheadtxt);
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


});

/**
 * End to End scenarios - test description is intuitive and gives fair idea
 */
describe("End to End scenarios ", function(){

    beforeEach(function () {

        browser.waitForAngularEnabled(false);
        driver.get(env.host['url']);

        login(fetch['uid'], fetch['pwd']);
    });

    it('Check Tip 1 Submission', function () {

        driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
        // driver.findElement(By.css(fetch['searchfield'])).sendKeys('books');

        let searchbutton = driver.findElement(By.css(fetch['searchbutton']));
        runjs(searchbutton);
        //driver.wait(element(by.css(fetch['continuebutton'])).isDisplayed(), 30);

        element.all(by.css(fetch['allgifs'])).each(function (item, index) {
            driver.sleep(9000);

            capture("alltengifs");

            if(index == 0){
                item.getWebElement().click();
                // logger.info("Selected a gif");
               capture("pickonegif");
            }

        });

        element(by.css(fetch['continuebutton'])).click();
        capture("continue");


        if(element(by.css(fetch['tiphone'])).isDisplayed()) {
            // logger.info("About to give tip");

            driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['one']);

            element.all(by.css(fetch['buttons'])).each(function (button, index) {
                // logger.info("Fetch buttons"+index);
                if (index == 1 ) {
                     runjs(button.getWebElement());
                     // logger.info("Gave a tip of "+fetch['five']);
                     capture("tipsubmit"+fetch['one']);
                }
            });

        }
        element.all(by.css(fetch['amountcard'])).each(function(element, index) {
            // Will print 0 First, 1 Second, 2 Third.
            capture("finalcard");
            element.getText().then(function (text) {
                // logger.info(index, text);
                element.getWebElement().click();
                // doitagain();
            });
        });

        logout();

    });

    // End-to-End Scenario with Tip 5 and click Do it Again
    it('Check Tip 5 Submission and Do it Again', function () {

            driver.findElement(By.xpath(fetch['searchheaderone'])).isDisplayed();
            let searchfield = driver.findElement(By.css(fetch['searchfield'])).sendKeys('bikes');
            searchfield.clear();
            searchfield.send.sendKeys('bikes');

            let searchbutton = driver.findElement(By.css(fetch['searchbutton']));
            runjs(searchbutton);

            element.all(by.css(fetch['allgifs'])).each(function (item, index) {
                    driver.sleep(9000);

                    capture("allgifs");

                    if(index == 0){
                       item.getWebElement().click();
                      // logger.info("Selected a gif");
                      capture("onegif");
                }
            });

            element(by.css(fetch['continuebutton'])).click();
            capture("continueclick");

            if(element(by.css(fetch['tiphone'])).isDisplayed()) {
                 // logger.info("About to give tip");

                driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['five']);
                element.all(by.css(fetch['buttons'])).each(function (button, index) {
                    // logger.info("Fetch buttons"+index);
                    if (index == 1 ) {

                        runjs(button.getWebElement());
                        // logger.info("Gave a tip of "+fetch['five']);
                        capture("tipsubmit"+fetch['five']);
                    }
                });
            }
            element.all(by.css(fetch['amountcard'])).each(function(element, index) {
                // Will print 0 First, 1 Second, 2 Third.
                capture("finalcard");
                element.getText().then(function (text) {
                    // logger.info(index, text);
                    if(index == 0) {
                          // logger.info("Doing it again");
                         element.click();
                    }
                });
            });
    });
});

