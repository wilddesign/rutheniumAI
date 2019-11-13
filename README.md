RutheniumAI.js

Hi! I'm Wojciech Nogaś, a phd student in olefin metathesis at the University of Warsaw.

Save for chemistry, I program in JS stack and to solve the question of choosing the best catalyst for industrially important ethenolysis reaction I wrote this Node.js script that uses simple Machine Learning library to learn literature data for this reaction and allows a chemist to simulate the activity of a new arbitrary catalyst. Obviously, first a set of proper descriptors has to be chosen, since this is supervised learning :) provided are topological descriptors for both the NHC and benzylidene, but the underlying phenomena are much more complex and these are way too little to learn correct structure - activity relationship. It's just a starting point.

Functionalities to be added:
a) automatic splitting of provided dataset: 80% as training set, 20% as test set. While learning, learning rate should be automatically optimized and learning iteration should be stopped when no further improvement in the test is observed as the itertions pass.
b) trained networks should be exported and stored in a file for further access
c) as chemists, we know a variety of experimental data for the catalysts. However, it is up to the program to find the important among them and use them for learning. This may be done in an unsupervised way or another.
d) the program should choose which descriptors provide best quantitative structure-activity relationship.

So, in summary, we need to apply several optimizations for the aspects of the program.
