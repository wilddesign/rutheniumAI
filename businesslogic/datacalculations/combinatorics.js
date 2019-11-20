


function getAllSubsetsOfASet(set){
  //powerset algorithm
  let setOfAllSubsets = [[]];
  set.forEach(function(descriptor){
    setOfAllSubsets.forEach(function(entry){
      let newEntry = entry.concat([descriptor]);
      setOfAllSubsets.push(newEntry);
    });
  });

  return setOfAllSubsets;
};


module.exports = {

  getAllSubsetsOfASet: getAllSubsetsOfASet

}
