const FILE_LOADER = require('./dataretrieve/index.js');
const CHEM_CALC_SERVICE = require('./datacalculations/index.js');
const ML_SERVICE = require('./mlcalculations/index.js');


async function loadTrainingData(configs){
  //returns an object containing catalysts and reaction for each catalysts
  let catalystsFileName = configs.data_configs.catalysts_data_file;
  let reactionsFileName = configs.data_configs.reactions_data_file;

  let catalysts = await FILE_LOADER.loadJson(catalystsFileName);
  let reactions = await FILE_LOADER.loadJson(reactionsFileName);

  let dataObject = {
    catalysts: await catalysts,
    reactions: await reactions
  }

  return dataObject;
}

async function loadPredictionData(configs){
  //returns an object containing catalysts and reaction for each catalysts
  let catalystsFileName = configs.input_file;

  let catalysts = await FILE_LOADER.loadJson(catalystsFileName);

  let dataObject = {
    catalysts: await catalysts
  }

  return dataObject;
}


function preprocessData(data, configs){
  //perform calculations for the catalysts according to configs
  data.catalysts.forEach(function(catalyst){
    let newNHC_substituent_1 = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_substituent_1, 'NHC_substituent_1');
    delete catalyst.NHC_substituent_1;
    let newNHC_substituent_2 = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_substituent_2, 'NHC_substituent_2');
    delete catalyst.NHC_substituent_2;
    let newNHC_substituent_12 = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_substituent_12, 'NHC_substituent_12');
    delete catalyst.NHC_substituent_12;
    let newNHC_substituent_3 = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_substituent_3, 'NHC_substituent_3');
    delete catalyst.NHC_substituent_3;
    let newNHC_substituent_4 = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_substituent_4, 'NHC_substituent_4');
    delete catalyst.NHC_substituent_4;

    Object.assign(catalyst, newNHC_substituent_1, newNHC_substituent_2,newNHC_substituent_12,newNHC_substituent_3,newNHC_substituent_4);
  })
  return data;
}


function buildTrainingDataForSynaptic(input){

  let outputTensor = [];

  input.catalysts.forEach(function(catalyst){
  //use this as input to result array
    input.reactions.forEach(function(reaction){
      if (catalyst.catalyst_name == reaction.catalyst){

        // input is catalyst topological indices coverted to arrays and concatenated
        delete catalyst['catalyst_nr'];
        delete catalyst['catalyst_name'];
        let catalystInput = Object.values(catalyst);
        // output is an array of reaction data save for identifiers
        let catalystOutput = [reaction.conversion,reaction.yield,reaction.selectivity, reaction.ton];

        let tensorEntry = {
          input: catalystInput,
          output: catalystOutput
        };
        outputTensor.push(tensorEntry);
      }
    });
  });
  return outputTensor;
}

function buildTestingDataForSynaptic(input){
  let outputTensor = [];
  input.catalysts.forEach(function(catalyst){
  //use this as input to result array
      // input is catalyst topological indices coverted to arrays and concatenated
      let catalystValues = Object.values(catalyst);
      catalystValues.splice(0,2);

      let tensorEntry = {
        input: catalystValues,
      };
      outputTensor.push(tensorEntry);
  });
  return outputTensor;
}

function showResults(results){
  console.log('Predicted results for a catalyst: ');
  console.log('Predicted conversion: ' + (100*results[0]).toFixed(0));
  console.log('Predicted yield: ' + (100*results[1]).toFixed(0));
  console.log('Predicted selectivity: ' + (100*results[2]).toFixed(0));
  console.log('Predicted TON: ' + 1000000*(results[3].toFixed(3)));
}


async function demoPerceptron(configs){
  //load data, calculate indices, build model, train, test
  let trainingData = await loadTrainingData(configs);
  let dataWithCalculatedIndices = preprocessData(await trainingData, configs.calculations_configs);
  let trainingSetReadyForSynaptic = buildTrainingDataForSynaptic(await dataWithCalculatedIndices);

  // ML
  let optimalPerceptron = ML_SERVICE.autoModeCreateAndTestOptimizedPerceptron(await trainingSetReadyForSynaptic);

  // once the neural network is trained, it is high time to perform simulations or testing with a prediction set
  let predictionSet = await loadPredictionData(configs.prediction_configs);
  let predictionSetWithCalculatedIndices = preprocessData(await predictionSet, configs.calculations_configs);
  let predictionSetReadyForSynaptic = buildTestingDataForSynaptic(await predictionSetWithCalculatedIndices);

  let test = Object.values(await predictionSetReadyForSynaptic[0].input);
  let results = optimalPerceptron.activate(await test);
  showResults(await results);
}


function testAllDataForAllDescriptorsSets(dataset, descriptorsSets){
  let results = [];
  // for each descriptorsSet, filter the copy of the dataset and use the filtered dataset to create NN and test it. return statistical params for that nn
  descriptorsSets.forEach(function(descriptorsSet){
    let newResult = {
      descriptorsSet: descriptorsSet
    };
    let datasetCopy = JSON.parse(JSON.stringify(dataset));

    descriptorsSet.forEach(function(descriptor){
      datasetCopy.forEach(function(entry){
        delete entry.input[descriptor];
      });
    });

    // when filtered datasetCopy is created, use it to train and test a NN
    let neuralNetworkAndStats = ML_SERVICE.autoModeCreateAndTestOptimizedPerceptron(datasetCopy);
    newResult.neuralNetworkAndStats = neuralNetworkAndStats;
    results.push(newResult);
  })

  return results;
}

module.exports = {

  simplePerceptronUsingCalculatedIndices: demoPerceptron

}
