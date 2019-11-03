const FILE_LOADER = require('./dataretrieve/index.js');
const CHEM_CALC_TOPOLOGICAL_SERVICE = require('./datacalculations/index.js');


async function loadData(configs){
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

function calculateIndicesForCatalysts(data, configs){

  data.catalysts.forEach(function(catalyst)
  {
    catalyst.NHC_data = CHEM_CALC_TOPOLOGICAL_SERVICE.calculateIndices(configs.indices, catalyst.NHC_data);
    catalyst.alkylidene_data = CHEM_CALC_TOPOLOGICAL_SERVICE.calculateIndices(configs.indices, catalyst.alkylidene_data);
  });

  return data;
  //console.log(await data.catalysts);
}

function buildTrainingDataForSynaptic(input){

  let outputTensor = [];

  input.catalysts.forEach(function(catalyst){
  //use this as input to result array
    input.reactions.forEach(function(reaction){
      if (catalyst.catalyst_name == reaction.catalyst){

        // input is catalyst topological indices coverted to arrays and concatenated
        let catalystInput = Object.values(catalyst.NHC_data)+Object.values(catalyst.alkylidene_data);
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

function createModel(){
  //create model from layers and compile it
}

function formatDataForSynaptic(data){
  //create model from layers and compile it
  //console.log(data);
}


async function main(configs){
  //load data, calculate indices, build model, train, test
  let data = await loadData(configs);
  let dataWithCalculatedIndices = calculateIndicesForCatalysts(await data, configs.calculations_configs);
  let trainingSetReadyForSynaptic = buildTrainingDataForSynaptic(await dataWithCalculatedIndices);
  console.log(await trainingSetReadyForSynaptic);
  //let dataWithCalculatedIndices = buildTensor(await data, await configs);
  //let tensor = buildTensor(await dataWithCalculatedIndices);

}

module.exports = {

  main: main

}
