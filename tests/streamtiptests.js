'use strict';

require('async');
let env = require( './../config/env.json');
let all = require( './../resources/data.json');

let fetch = all.data;

let chai = require('chai');
let expect = chai.expect;
let Support = require("./../utils/support.js");
let logger = require('./../config/config-log4js.js');


describe('Stream Tip Tests', function () {
    let thisSuite = this;
    let driver;
    logger.info('---- StreamTips Test suite----');

    thisSuite.support = new Support();

    beforeEach( function(){
        driver = browser.driver;
        // logger.info('<<<Before Each>>>');
        browser.waitForAngularEnabled(false);
        driver.get(env.host['url']);

        /* browser.wait(function() {

            browser.ignoreSynchronization = true;
            return $('#auto-refresh').isPresent();
        });*/

    });


    it('Initial Launch', function(){
        logger.info(`Initial Launch test `);
        expect(driver.getTitle(),'qa_test_1');
    });

    it('Fetch login page labels', function(){
        let usrlabel = driver.findElement(By.css(fetch['username'])).getText();
        let pwdlabel = driver.findElement(By.css(fetch['password'])).getText();
        expect(fetch['userlabel'],usrlabel);
        expect(fetch['passwordlabel', pwdlabel]);
    });

    it('Fetch login page fields', function(){
        let uidfield = driver.findElement(By.css(fetch['userinputfield'])).getText();
        let pwsfield = driver.findElement(By.css(fetch['passwordinputfield'])).getText();
        let loginbuttontext = driver.findElement(By.css(fetch['loginbutton'])).getText();
        expect(fetch['userdefaultvalue'],uidfield);
        expect(fetch['passworddeafultvalue'],pwsfield);
        expect(fetch['loginname'],loginbuttontext);
    });

    it('Empty fields submitted error', function(){
        driver.findElement(By.css(fetch['loginbutton'])).click();
        // driver.switchTo().defaultContent();

        let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();

        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'],checkmsg);
    });

    it('Valid username entered with Password empty',  function(){
        driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['uid']);
        driver.findElement(By.css(fetch['loginbutton'])).click();
        let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();
        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'],checkmsg);
    });

    it('Valid Password entered with Username Empty ',  function(){
        driver.findElement(By.css(fetch['passwordinputfield'])).sendKeys(fetch['pwd']);
        driver.findElement(By.css(fetch['loginbutton'])).click();
         let checkmsg = driver.findElement(By.css(fetch['errorbox'])).getText();
        driver.findElement(By.linkText(fetch['closebutton'])).click();
        expect(fetch['error'],checkmsg);

    });

    it('Valid Credentials - Signin Success', function(){
        driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['uid']);
        driver.findElement(By.css(fetch['passwordinputfield'])).sendKeys(fetch['pwd']);
        driver.findElement(By.css(fetch['loginbutton'])).click();
        let searchheader = driver.findElement(By.xpath(fetch['searchheaderone'])).getText();
        driver.findElement(By.linkText(fetch['logofftext'])).click();
        let usrlabel = driver.findElement(By.css(fetch['username'])).getText();
        let pwdlabel = driver.findElement(By.css(fetch['password'])).getText();
        expect(fetch['userlabel'],usrlabel);
        expect(fetch['passwordlabel', pwdlabel]);
        expect(fetch['searchheaderoneval'],searchheader);
    });

    it('Fetch all default GIFs without search by keyword/click selection', function () {
        driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['uid']);
        driver.findElement(By.css(fetch['passwordinputfield'])).sendKeys(fetch['pwd']);
        driver.findElement(By.css(fetch['loginbutton'])).click();

        element.all(by.css(fetch['childgifs'])).then(function(items) {
            expect(items.length,10);
        });

        driver.findElement(By.linkText(fetch['logofftext'])).click();

    });

    /*
     Fixing Random selection issue
     */

    it.skip('Click select one GIF randomly', function () {
        driver.findElement(By.css(fetch['userinputfield'])).sendKeys(fetch['uid']);
        driver.findElement(By.css(fetch['passwordinputfield'])).sendKeys(fetch['pwd']);
        driver.findElement(By.css(fetch['loginbutton'])).click();

        let index = Math.floor(Math.random()*10+1);
        let onegifrandom = fetch['onegifselection']+index+"]";
        logger.info("Gif selected is >>>"+onegifrandom);
        driver.findElement(By.xpath(onegifrandom)).click();
        driver.findElement(By.linkText(fetch['logofftext'])).click();

    });

});

