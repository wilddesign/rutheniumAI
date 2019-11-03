const FS_PROMISES = require('fs').promises;
const FILE_LOADER = require('./businesslogic/dataretrieve/index.js');
const BUSINESS_LOGIC_SERVICE = require('./businesslogic/index.js');


(async function() {
  //load confugurations file for the program
    const CONFIGS = await FILE_LOADER.loadJson('config.json');
  //perform the business logic with the tf module and return the results
    let output = BUSINESS_LOGIC_SERVICE.main(await CONFIGS.configs);
  //load data according to configurations file
  //  let data = TF_SERVICE.loadData(await CONFIGS.configs.data_configs);
  //prepare tensors for the neural network
  //  let neuralNetworkInput = prepareNeuralNetworkInput(await data, await CONFIGS.configs.calculations_configs);
  //train the neural network and test it with new catalysts given in the configurations file
  //  let output = trainNeuralNetwork(await neuralNetworkInput);
  //return the results
    console.log(await output);
})();
