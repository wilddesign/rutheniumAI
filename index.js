const FS_PROMISES = require('fs').promises;

const filesOperations = require('./dataretrieve/index.js');
//function loadDataBase(configObject) {
//  console.log(configObject);
//};

function prepareNeuralNetworkInput(data) {
  //console.log(data);
};

function trainNeuralNetwork(configObject) {
  //console.log(configObject);
};






(async function() {
  //load confugurations file for the program
    const CONFIGS = await filesOperations.loadConfigs();
  //load data according to configurations file
    let data = filesOperations.loadDataBase(await CONFIGS.configs.data_configs);
  //prepare tensors for the neural network
    let neuralNetworkInput = prepareNeuralNetworkInput(await data, await CONFIGS.configs.calculations_configs);
  //train the neural network and test it with new catalysts given in the configurations file
    let output = trainNeuralNetwork(await neuralNetworkInput);
  //return the results
//  console.log(output);
})();
