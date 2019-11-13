const SYNAPTIC = require('synaptic');


function simpleTrainer(network, trainingSet){
  let trainer = new SYNAPTIC.Trainer(network);
  let currentError = 0;
  trainer.train(trainingSet, {
    rate: 0.05,
    iterations: 50000,
    error: 0.005,
    shuffle: false,
    schedule: {
      every: 1000,
      do: function(data){
        let errorImprovement = data.error - currentError;
        currentError = data.error;
        console.log(errorImprovement);
        // finish training when there is no error improvement or error increases
        if (errorImprovement <= 0.001) {return true;}
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


module.exports = {
  simpleTrainer: simpleTrainer,
  autoCreatePerceptron: createPerceptronFittingToDataSize
}
