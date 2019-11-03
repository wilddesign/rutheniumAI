
const MOLECULES = require('molecules.js');

function calculateIndices(indices, moleculeInputSmiles){
  let indicesObject = {};

  if (indices == 'all_topological' && moleculeInputSmiles){

      let molecule = MOLECULES.load.smiles(moleculeInputSmiles);

      // calculate matrices
      let adjacencyMatrix = MOLECULES.topology.matrix.adjacency(molecule);
      let distanceMatrix = MOLECULES.topology.matrix.distance(adjacencyMatrix);
      let degreeMatrix = MOLECULES.topology.matrix.degree(adjacencyMatrix);
      let reciprocalMatrix = MOLECULES.topology.matrix.reciprocal(distanceMatrix);
      let randicMatrix = MOLECULES.topology.matrix.randic(adjacencyMatrix, degreeMatrix);

      // calculate indices
      let wienerIndex = MOLECULES.topology.index.wiener(distanceMatrix);
      let hyperWienerIndex = MOLECULES.topology.index.hyperwiener(distanceMatrix);
      let hararyIndex = MOLECULES.topology.index.harary(reciprocalMatrix);
      let balabanIndex = MOLECULES.topology.index.balaban(distanceMatrix);
      let randicIndex = MOLECULES.topology.index.randic(randicMatrix);

      //insert into the object
      indicesObject = {
        wienerIndex: wienerIndex,
        hyperWienerIndex: hyperWienerIndex,
        hararyIndex: hararyIndex,
        balabanIndex: balabanIndex,
        randicIndex: randicIndex
      }
  }

  return indicesObject;
};


module.exports = {

  calculateIndices: calculateIndices

}
