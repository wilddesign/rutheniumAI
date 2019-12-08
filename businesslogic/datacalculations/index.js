
const MOLECULES = require('molecules.js');

function calculateIndices(indices, moleculeInputSmiles, objectNamePrefix){
  let indicesObject = {};

  if (indices == 'wiener' && moleculeInputSmiles){

      let molecule = MOLECULES.load.smiles(moleculeInputSmiles);
      // calculate matrices
      let adjacencyMatrix = MOLECULES.topology.matrix.adjacency(molecule);
      let distanceMatrix = MOLECULES.topology.matrix.distance(adjacencyMatrix);
      let degreeMatrix = MOLECULES.topology.matrix.degree(adjacencyMatrix);
      let reciprocalMatrix = MOLECULES.topology.matrix.reciprocal(distanceMatrix);
      let randicMatrix = MOLECULES.topology.matrix.randic(adjacencyMatrix, degreeMatrix);

      // calculate indices
      let wienerIndex = MOLECULES.topology.index.wiener(distanceMatrix)/10000;
      let hyperWienerIndex = MOLECULES.topology.index.hyperwiener(distanceMatrix)/10000;
      let hararyIndex = MOLECULES.topology.index.harary(reciprocalMatrix)/10000;
      let balabanIndex = MOLECULES.topology.index.balaban(distanceMatrix)/10000;
      let randicIndex = MOLECULES.topology.index.randic(randicMatrix)/10000;

      //insert into the object
      indicesObject[objectNamePrefix+'wienerIndex'] = wienerIndex;
  //    indicesObject[objectNamePrefix+'hyperWienerIndex'] = hyperWienerIndex;
  //    indicesObject[objectNamePrefix+'hararyIndex'] = hararyIndex;
  //    indicesObject[objectNamePrefix+'balabanIndex'] = balabanIndex;
  //    indicesObject[objectNamePrefix+'randicIndex'] = randicIndex;
  }

  if (!moleculeInputSmiles){
    indicesObject[objectNamePrefix+'wienerIndex'] = 0;
//    indicesObject[objectNamePrefix+'hyperWienerIndex'] = 1;
//    indicesObject[objectNamePrefix+'hararyIndex'] = 1;
//    indicesObject[objectNamePrefix+'balabanIndex'] = 1;
//    indicesObject[objectNamePrefix+'randicIndex'] = 1;
  }

  return indicesObject;
};


module.exports = {

  calculateIndices: calculateIndices

}
