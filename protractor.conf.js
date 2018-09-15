exports.config = {
  allScriptsTimeout: 90000, // The timeout for a script run on the browser.
  specs: ['./tests/*.js'],
  baseUrl: 'http://localhost:8080/', // base url of the SUT
<<<<<<< HEAD
  multicapabilities:[{'browserName': 'chrome'},
    {'browserName': 'firefox'}
 ],
=======
  multicapabilities:[{
    {'browserName': 'chrome'},
    {'browserName': 'firefox'}
  }] ,
>>>>>>> acf6f0872595f6045822affa79ad55aa1bcadb6b
  directConnect: true, // selenium will not need a server chrome
  framework: 'mocha', // Use mocha
  mochaOpts: { // Mocha specific options
    reporter: "spec",
    slow: 5000,
    ui: 'bdd',
    timeout: 100000
  },
  onPrepare: function() {



  }
};
