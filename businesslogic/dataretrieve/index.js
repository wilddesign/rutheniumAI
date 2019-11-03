

const FS_PROMISES = require('fs').promises;


async function loadJson(filename) {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open(filename);
    let json = await fileHandle.readFile();
    let configs = await JSON.parse(json);
    return configs;
};


module.exports = {

  loadJson: loadJson

}
