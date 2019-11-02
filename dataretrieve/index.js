
//let loadDataBase = require('./dataLoading.js');
//console.log(loadDataBase);

const FS_PROMISES = require('fs').promises;
const CSV_PARSE = require('papaparse');



async function loadConfigs() {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open('config.json');
    let configJSON = await fileHandle.readFile();
    let configs = await JSON.parse(configJSON);
    return configs;
};

async function loadDataBase(configObject) {
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

module.exports = {

  loadConfigs: loadConfigs,
  loadDataBase: loadDataBase

}
