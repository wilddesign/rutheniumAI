

const TF = require('@tensorflow/tfjs');



async function loadCsvFile(filename){
  const csv = TF.data.csv(filename ,{
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
    await csv.forEachAsync(e => console.log(e));
}


async function loadData(configs){
  //returns an object containing catalysts and reaction for each catalysts

  const xd = await loadCsvFile(configs.catalysts_data_file);
return xd;
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




/*

async function loadConfigs() {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open('config.json');
    let configJSON = await fileHandle.readFile();
    let configs = await JSON.parse(configJSON);
    return configs;
};

async function loadDataBase(configObject) {
  //load the csv file using tf



  //gets the filename, retrieves the .csv file, parses that to an object and returns it
  let fileHandle = await FS_PROMISES.open(configObject.catalysts_data_file);
  let dataCsv = await fileHandle.readFile();
  return dataCsv;
//console.log(dataCsv);
//  let dataObject = await CSV_PARSE.parse(await dataCsv);
//  console.log(dataObject);
  //return dataObject;
  //console.log(dataObject);
};
*/
module.exports = {

  loadData: loadData

}
