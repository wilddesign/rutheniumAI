

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
    await csvFile.forEachAsync(function(catalyst)
    {
      catalyst.NHC_data = CHEM_CALC_SERVICE.calculateIndices('all_indices', catalyst.xs.NHC_data);
      catalyst.alkylidene_data = CHEM_CALC_SERVICE.calculateIndices('all_indices', catalyst.xs.alkylidene_data);
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

    let csvRawData=[];
/*
    await csvFile.forEachAsync(function(catalyst)
    {
      console.log(catalyst);
    });*/
  //  console.log(await csvRawData);
}


async function loadData(configs){
  //returns an object containing catalysts and reaction for each catalysts
  const catalysts = await loadCatalystsFile(configs.data_configs.catalysts_data_file);
  const reactions = await loadReactionsFile(configs.data_configs.reactions_data_file);
  //console.log(await catalysts);
  let dataObject = {
    catalysts: await catalysts,
    reactions: await reactions
  }
  console.log(await dataObject);
}

async function businessLogic(){
  //load data, calculate indices, build model, train, test
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

  performBusinessLogic: loadData

}
