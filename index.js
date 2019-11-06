const FS_PROMISES = require('fs').promises;
const FILE_LOADER = require('./businesslogic/dataretrieve/index.js');
const BUSINESS_LOGIC_SERVICE = require('./businesslogic/index.js');


(async function() {
  //load confugurations file for the program
    const CONFIGS = await FILE_LOADER.loadJson('config.json');
  //perform the business logic with the ml module and return the results
    let output = BUSINESS_LOGIC_SERVICE.simplePerceptronUsingCalculatedIndices(await CONFIGS.configs);
})();
