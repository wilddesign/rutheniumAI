RutheniumAI.js

Hi! I'm Wojciech Nogaś, a phd student in olefin metathesis at the University of Warsaw.

Save for chemistry, I program in JS stack and to solve the question of choosing the best catalyst for industrially important ethenolysis reaction I wrote this Node.js script that uses simple Machine Learning library to learn literature data for this reaction and allows a chemist to simulate activity of a new arbitrary catalyst. Obviously, first a set of proper descriptor has to be chosen, since this is supervised learning :) provided are topological descriptors for both the NHC and benzylidene, but the underlying phenomena are much more complex and these are way too little to learn correct structure - activity relationship. It's just a starting point.
