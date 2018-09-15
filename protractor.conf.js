exports.config = {
  allScriptsTimeout: 90000, // The timeout for a script run on the browser.
  specs: ['./tests/*.js'],
  baseUrl: 'http://localhost:8080/', // base url of the SUT
multicapabilities:[
    {'browserName': 'chrome'}
  ],
 directConnect: true, // selenium will not need a server chrome
  framework: 'mocha', // Use mocha
  mochaOpts: { // Mocha specific options
    reporter: "spec",
    slow: 5000,
    ui: 'bdd',
    timeout: 100000
  },
  onPrepare: function() { }
};
