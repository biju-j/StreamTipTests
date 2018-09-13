'use strict';

let envDetails = require( './../config/env.json');
let logger = require('./../config/config-log4js.js');
const baseurl = envDetails.host['url'];

class Support {

        constructor(){
        //noinspection JSAnnotator

            logger.info(` Running tests against ${baseurl} `);


        }


}

module.exports = Support;



