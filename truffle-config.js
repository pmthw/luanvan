const path = require('path');

module.exports = {
    contracts_build_directory: path.join(__dirname, 'src/contracts'),
    networks: {
      development: {
        host: "127.0.0.1",     
        port: 7545,            
        network_id: "*", 
      },
    },
  
    // Set default mocha options here, use special reporters, etc.
    mocha: {
      // timeout: 100000
    },
  
    compilers: {
      solc: {
        version: "0.8.2",      // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        // settings: {          // See the solidity docs for advice about optimization and evmVersion
        //  optimizer: {
        //    enabled: false,
        //    runs: 200
        //  },
        //  evmVersion: "byzantium"
        // }
      }
    },

  };