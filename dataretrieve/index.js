

const FS_PROMISES = require('fs').promises;


async function loadConfigs() {
  //load configurations file and returns it
    let fileHandle = await FS_PROMISES.open('config.json');
    let configJSON = await fileHandle.readFile();
    let configs = await JSON.parse(configJSON);
    return configs;
};


module.exports = {

  loadConfigs: loadConfigs

}
