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

function createPerceptronFittingToDataSize(data){console.log(data);
  if (data[0]){
    let inputSize = data[0].input.length;
    let hiddenLayerSize = inputSize + 1;
    let outputSize = data[0].output.length;

    return new SYNAPTIC.Architect.Perceptron(inputSize, hiddenLayerSize, outputSize);
  } else {
    console.log('Error, training set is empty.');
  }
}

function autoModeCreateOptimizedPerceptron(data){
  //create perceptrons for a range of hardcoded learning rates
  let learningRateRange = [1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001, 0.00005, 0.00001];
  let perceptronsList = [];
  learningRateRange.forEach(function(learningRate){
    //create Perceptron fitting to data size for each learning rate
    let perceptron = createPerceptronFittingToDataSize(data);
    //simply train it for a range of hardcoded learning rates
    simpleTrainer(perceptron, data, learningRate);
    // when trained, push to perceptronsList
    perceptronsList.push(perceptron);
  });

  // when perceptronsList is finished, test each perceptron to see, which is best
  let perceptronsTestResults = [];
  perceptronsList.forEach(function(perceptron){

  });
}


module.exports = {
  simpleTrainer: simpleTrainer,
  autoCreatePerceptron: createPerceptronFittingToDataSize,
  autoModeCreateOptimizedPerceptron: autoModeCreateOptimizedPerceptron
}
