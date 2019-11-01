const FS_PROMISES = require('fs').promises;



function loadDataBase(configObject) {
  console.log(configObject);
};

function prepareNeuralNetworkInput(data) {
  console.log(data);
};

function trainNeuralNetwork(configObject) {
  console.log(configObject);
};






(async function() {
  //load confugurations file for the program
    let fileHandle = await FS_PROMISES.open('config.json');
    let c = await fileHandle.readFile();
    const CONFIGS = await JSON.parse(c);

  //load data according to configurations file
    let data = loadDataBase(await CONFIGS.configs.data_configs);
  //prepare tensors for the neural network
    let neuralNetworkInput = loadDataBase(await data, await CONFIGS.configs.calculations_configs);
  //train the neural network and test it with new catalysts given in the configurations file
    let trainNeuralNetwork(await neuralNetworkInput);
})();
