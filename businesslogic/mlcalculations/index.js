const SYNAPTIC = require('synaptic');


function simpleTrainer(network, trainingSet){
  let trainer = new SYNAPTIC.Trainer(network);
  trainer.train(trainingSet, {
    rate: 0.1,
    iterations: 50,
    error: 0.005,
    shuffle: false,
    log: 10
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
