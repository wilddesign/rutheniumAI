

const TF = require('@tensorflow/tfjs');
const CHEM_CALC_SERVICE = require('./datacalculations/index.js');

async function loadCatalystsFile(filepath){
  const csvFile = TF.data.csv(filepath ,{
      hasHeader: true,
      columnConfigs: {
        catalyst_nr: {
          isLabel: true
        },
        catalyst_name: {
          isLabel: true
        }
      }
    });
    return await csvFile;
}

async function loadReactionsFile(filepath){
  const csvFile = TF.data.csv(filepath ,{
      hasHeader: true,
      columnConfigs: {
        reaction_nr: {
          isLabel: true
        },
        catalyst: {
          isLabel: true
        }
      }
    });
    return await csvFile;
}


async function loadData(configs){
  //returns an object containing catalysts and reaction for each catalysts
  const catalysts = loadCatalystsFile(configs.data_configs.catalysts_data_file);
  const reactions = loadReactionsFile(configs.data_configs.reactions_data_file);

  let dataObject = {
    catalysts: await catalysts,
    reactions: await reactions
  }
  return dataObject;
}

function calculateIndices(data){

  data.catalysts.forEachAsync(function(catalyst)
  {
    catalyst.xs.NHC_data = CHEM_CALC_SERVICE.calculateIndices('all_indices', catalyst.xs.NHC_data);
    catalyst.xs.alkylidene_data = CHEM_CALC_SERVICE.calculateIndices('all_indices', catalyst.xs.alkylidene_data);
  });

  return data;
  //console.log(await data.catalysts);
}

async function buildTensor(input, configs){
  //define a tensor, in which xs is an array of indices and ys are reaction data for that catalyst
  let outputTensor = input.catalysts.forEachAsync(function(catalyst){
    //calculate indices
    catalyst.xs.NHC_data = CHEM_CALC_SERVICE.calculateIndices(configs.calculations_configs.indices, catalyst.xs.NHC_data);
    catalyst.xs.alkylidene_data = CHEM_CALC_SERVICE.calculateIndices(configs.calculations_configs.indices, catalyst.xs.alkylidene_data);
    //put this as input to result array

    input.reactions.forEachAsync(function(reaction){
      if (catalyst.ys.catalyst_name == reaction.ys.catalyst){

        let tensorEntry = {
          xs: [catalyst.xs.NHC_data, catalyst.xs.alkylidene_data],
          ys: reaction.xs
        };

      }
    });
  });
        console.log(await outputTensor);
}

function createModel(){
  //create model from layers and compile it
}


async function main(configs){
  //load data, calculate indices, build model, train, test
  let data = loadData(configs);
  let dataWithCalculatedIndices = buildTensor(await data, await configs);
  //let tensor = buildTensor(await dataWithCalculatedIndices);

}

/*

const csvUrl =
'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

async function run() {
  // We want to predict the column "medv", which represents a median value of
  // a home (in $1000s), so we mark it as a label.
  const csvDataset = tf.data.csv(
    csvUrl, {
      columnConfigs: {
        medv: {
          isLabel: true
        }
      }
    });

  // Number of features is the number of column names minus one for the label
  // column.
  const numOfFeatures = (await csvDataset.columnNames()).length - 1;

  // Prepare the Dataset for training.
  const flattenedDataset =
    csvDataset
    .map(({xs, ys}) =>
      {
        // Convert xs(features) and ys(labels) from object form (keyed by
        // column name) to array form.
        return {xs:Object.values(xs), ys:Object.values(ys)};
      })
    .batch(10);

  // Define the model.
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [numOfFeatures],
    units: 1
  }));
  model.compile({
    optimizer: tf.train.sgd(0.000001),
    loss: 'meanSquaredError'
  });

  // Fit the model using the prepared Dataset
  return model.fitDataset(flattenedDataset, {
    epochs: 10,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(epoch + ':' + logs.loss);
      }
    }
  });
}

await run();
*/


module.exports = {

  main: main

}
