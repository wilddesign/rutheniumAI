RutheniumAI.js

Hi! I'm Wojciech Nogaś, a phd student in olefin metathesis at the University of Warsaw.

Save for chemistry, I program in JS stack and to solve the question of choosing the best catalyst for industrially important ethenolysis reaction I wrote this Node.js script that uses simple Machine Learning library to learn literature data for this reaction and allows a chemist to simulate the activity of a new arbitrary catalyst. Obviously, first a set of proper descriptors has to be chosen, since this is supervised learning :) provided are topological descriptors for both the NHC and benzylidene, but the underlying phenomena are much more complex and these are way too little to learn correct structure - activity relationship. It's just a starting point. The dataset is taken from a R. Grubbs's paper on ethenolysis with CAAC type catalysts from 2015 (Angew. Chem. Int. Ed. 2015, 54, 1919 – 1923).

This script uses a CAAC type catalyst structure (encoded as carbene NMR signals and structural features as SMILES) and its ethenolysis reaction parameters from the aforementioned paper as input data, learns it and tries to predict the activity of a new such catalyst provided in input.json.

Bigger datasets are necessary, but the framework is scalable.
