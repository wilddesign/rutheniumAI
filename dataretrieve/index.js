

const FS_PROMISES = require('fs').promises;


async function loadJson(file) {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open(file);
    let json = await fileHandle.readFile();
    let jsonParsed = JSON.parse(await json);
    return await jsonParsed;
};


module.exports = {

  loadJson: loadJson

}
