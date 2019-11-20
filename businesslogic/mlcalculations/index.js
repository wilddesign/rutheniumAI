const SYNAPTIC = require('synaptic');


function simpleTrainer(network, trainingSet, rate){
  let trainer = new SYNAPTIC.Trainer(network);
  let currentError = 0;
  trainer.train(trainingSet, {
    rate: rate || 0.05,
    // max iterations
    iterations: 100000,
    error: 0.005,
    shuffle: false,
    schedule: {
      every: 1000,
      do: function(data){
        let errorImprovement = data.error - currentError;
        currentError = data.error;
        // finish training when there is no error improvement or error increases
        if (errorImprovement <= 0.00001) {return true;}
      }
    }
  });
  return network;
}

function createPerceptronFittingToDataSize(data){
  if (data[0]){
    let inputSize = data[0].input.length;
    let hiddenLayerSize = inputSize + 1;
    let outputSize = data[0].output.length;

    return new SYNAPTIC.Architect.Perceptron(inputSize, hiddenLayerSize, outputSize);
  } else {
    console.log('Error, training set is empty.');
  }
}

function customTestPerceptron(perceptron, data){
  console.log(perceptron, data);
}

function testNeuralNetworkWithNewDataPoints(network, newDataPoints){

}

function divideDataSetIntoTrainingAndTestSet(data){
  // randomly take 30% of data for testing
  let dataLength = data.length;
  let testLength = Math.floor(0.3*dataLength);

  let trainingSet = data;
  let testSet = [];

  for(i = 0; i<testLength; i++){
    let randomIndex = Math.floor(Math.random()*trainingSet.length);
    let newTestEntry = trainingSet.splice(randomIndex, 1);
    testSet.push(newTestEntry);
  }

console.log({
  trainingSet: trainingSet,
  testSet: testSet
});
  return {
    trainingSet: trainingSet,
    testSet: testSet
  }
}

function autoModeCreateAndTestOptimizedPerceptron(data){
  // return if improper arguments
  if (Object.keys(data[0].input).length === 0 || Object.keys(data[0].output).length === 0) {return;}
  //divide the data into training set and test set
  let dividedData = divideDataSetIntoTrainingAndTestSet(data);
  //create perceptrons for a range of hardcoded learning rates
  let learningRateRange = [1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001, 0.00005, 0.00001];
  let perceptronsList = [];
  learningRateRange.forEach(function(learningRate){
    //create Perceptron fitting to data size for each learning rate
    let perceptron = createPerceptronFittingToDataSize(dividedData.trainingSet);
    //simply train it for a range of hardcoded learning rates
    simpleTrainer(perceptron, dividedData.trainingSet, learningRate);
    // when trained, push to perceptronsList
    perceptronsList.push(perceptron);
  });

  // when perceptronsList is finished, test each perceptron to see, which is best
  let perceptronsTestResults = [];
  perceptronsList.forEach(function(perceptron){
    let testResult = testNeuralNetworkWithNewDataPoints(perceptron, dividedData.testSet);
    let perceptronsTestResult = {
      perceptron: perceptron,
      stats: testResult
    };
    perceptronsTestResults.push(perceptronsTestResult);
  });
  // when it is ready, sort the perceptronResults by stats and return that one with lowest variance
  perceptronsTestResults.sort(function(a,b){return b.testResult-a.testResult;});
  //return the best optimized nn and its stats at prediction of testing set
  return perceptronsTestResults[0];
}


module.exports = {
  simpleTrainer: simpleTrainer,
  autoCreatePerceptron: createPerceptronFittingToDataSize,
  autoModeCreateAndTestOptimizedPerceptron: autoModeCreateAndTestOptimizedPerceptron
}
