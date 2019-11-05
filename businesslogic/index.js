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


function calculateIndicesForCatalysts(data, configs){

  data.catalysts.forEach(function(catalyst)
  {
    catalyst.NHC_data = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.NHC_data);
    catalyst.alkylidene_data = CHEM_CALC_SERVICE.calculateIndices(configs.indices, catalyst.alkylidene_data);
  });

  return data;
}

function formatSpecificBuildInputForSynaptic(catalyst){

  let catalystInputObject = {
    isPhosphine: catalyst.is_phosphine,
    chloride_or_iodide: catalyst.chloride_or_iodide,
    NHC_data: catalyst.NHC_data,
    alkylidene_data: catalyst.alkylidene_data
  }

  let buildArray1 = [catalystInputObject.isPhosphine, catalystInputObject.chloride_or_iodide];
  let buildArray2 = Object.values(catalystInputObject.NHC_data);
  let buildArray3 = Object.values(catalystInputObject.alkylidene_data);

  return (buildArray1.concat(buildArray2)).concat(buildArray3);
}

function buildTrainingDataForSynaptic(input){

  let outputTensor = [];

  input.catalysts.forEach(function(catalyst){
  //use this as input to result array
    input.reactions.forEach(function(reaction){
      if (catalyst.catalyst_name == reaction.catalyst){

        // input is catalyst topological indices coverted to arrays and concatenated
        let catalystInput = formatSpecificBuildInputForSynaptic(catalyst);
        //console.log(catalystInput);
        // output is an array of reaction data save for identifiers
        let catalystOutput = [reaction.conversion,reaction.yield1,reaction.yield2,reaction.selectivity];

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
      let catalystInput = formatSpecificBuildInputForSynaptic(catalyst);
      let tensorEntry = {
        input: catalystInput,
      };
      outputTensor.push(tensorEntry);
  });
  return outputTensor;
}


async function main(configs){
  //load data, calculate indices, build model, train, test
  let trainingData = await loadTrainingData(configs);
  let dataWithCalculatedIndices = calculateIndicesForCatalysts(await trainingData, configs.calculations_configs);
  let trainingSetReadyForSynaptic = buildTrainingDataForSynaptic(await dataWithCalculatedIndices);

  // ML
  let simplePerceptron = ML_SERVICE.autoCreatePerceptron(await trainingSetReadyForSynaptic);
  ML_SERVICE.simpleTrainer(await simplePerceptron, await trainingSetReadyForSynaptic);

  // once the neural network is trained, it is high time to perform simulations or testing with a prediction set
  let predictionSet = await loadPredictionData(configs.prediction_configs);
  let predictionSetWithCalculatedIndices = calculateIndicesForCatalysts(await predictionSet, configs.calculations_configs);
  let predictionSetReadyForSynaptic = buildTestingDataForSynaptic(await predictionSetWithCalculatedIndices);
  let results = simplePerceptron.activate(await predictionSetReadyForSynaptic[0].input);
  console.log('Predicted results for a catalyst: ');
  console.log('Predicted conversion: ' + await results[0].toFixed(2));
  console.log('Predicted yield1: ' + await results[1].toFixed(2));
  console.log('Predicted yield2: ' + await results[2].toFixed(2));
  console.log('Predicted selectivity: ' + await results[3].toFixed(2));

}

module.exports = {

  main: main

}
