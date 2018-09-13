let fsExtra =require('fs-extra');
let path =require('path');

fsExtra.emptyDirSync(path.resolve(process.cwd(), './log'));

let log4js = require('log4js');

const logLevel = process.env.LOG_LEVEL || 'INFO';
const loggerConfigurationOptions = { appenders: [{type: 'console'}] };
let logger = log4js.getLogger('streams_tips-execution');

log4js.configure(loggerConfigurationOptions);
logger.setLevel(logLevel);

module.exports = logger;