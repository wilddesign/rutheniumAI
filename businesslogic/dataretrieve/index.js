

const FS_PROMISES = require('fs').promises;


async function loadJson(filename) {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open(filename);
    let json = await fileHandle.readFile();
    let configs = await JSON.parse(json);
    //close the file so that it is not left open and garbage collector does not return an error
    await fileHandle.close();
    return configs;
};


module.exports = {

  loadJson: loadJson

}
