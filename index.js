const FS_PROMISES = require('fs').promises;
const LOAD_CONFIGS = require('./dataretrieve/index.js');
const TF_SERVICE = require('./tf/index.js');


(async function() {
  //load confugurations file for the program
    const CONFIGS = await LOAD_CONFIGS.loadConfigs();

  //perform the business logic with the tf module and return the results
    let output = TF_SERVICE.performBusinessLogic(await CONFIGS.configs);
  //load data according to configurations file
  //  let data = TF_SERVICE.loadData(await CONFIGS.configs.data_configs);
  //prepare tensors for the neural network
  //  let neuralNetworkInput = prepareNeuralNetworkInput(await data, await CONFIGS.configs.calculations_configs);
  //train the neural network and test it with new catalysts given in the configurations file
  //  let output = trainNeuralNetwork(await neuralNetworkInput);
  //return the results
    console.log(await output);
})();
