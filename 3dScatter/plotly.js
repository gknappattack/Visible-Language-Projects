//Both this file and plotly.js handle the same set of data into a 3d scatter plot.
//This file uses Plotly's javascript 3d scatter plot library, which I honestly preferred over the Highcharts version
//(Highcharts is much better for 2d, not 3d charts.)

//In comparison to the Highcharts version, this one is much more javascript-esque vs. the 
//JSON style of Higcharts. With Plotly, you just read the data from csv or anywhere and 
//create a new trace for each set of data you want to display. 

//I would definitely recommend plotly over Highcharts, but will leave both for you to decide.


Plotly.d3.csv('https://gknappattack.github.io/BookOfMormonBubbleCharts/3dscatter/master.csv', function(err, rows) {


var x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [], z1 = [], z2 = [], z3 = [], z4 = [];

//TODO: automate column names from parsing rows[0]
var columnNames = [['x1','y1','z1'],['x2','y2','z2'],['x3','y3','z3'],['x4','y4','z4']];

//TODO: find alternative to hard coding which array values are entered into
for (var i = 0; i < rows.length; i++) {
    var row = rows[i];

    for (var j = 0; j < columnNames.length; j++) {
        var xKey = columnNames[j][0];
        var yKey = columnNames[j][1];
        var zKey = columnNames[j][2];

        var currX = row[xKey];
        var currY = row[yKey];
        var currZ = row[zKey];

        if (j == 0) {
            if (currX != "") {
                x1.push(currX);
            }
            if (currY != "") {
                y1.push(currY);
            }
            if (currZ != "") {
                z1.push(currZ);
            }

        }
        else if (j == 1) {
            if (currX != "") {
                x2.push(currX);
            }
            if (currY != "") {
                y2.push(currY);
            }
            if (currZ != "") {
                z2.push(currZ);
            }

        }
        else if (j == 2) {
            if (currX != "") {
                x3.push(currX);
    
            }
            if (currY != "") {
                y3.push(currY);
            }
            if (currZ != "") {
                z3.push(currZ);
            }

        }
        else if (j == 3) {
            if (currX != "") {
                x4.push(currX);
    
            }
            if (currY != "") {
                y4.push(currY);
            }
            if (currZ != "") {
                z4.push(currZ);
            }
        }
        
    }
}

function unpack(rows, key) {
	return rows.map(function(row){return row[key];});
}


//Each traces uses the unpack function to get all the values from the matching column in the linked csv files.
//The unpacked data is then associated with x,y, and z coordinates for the trace.
var trace1 = {
	x:unpack(rows, 'x1'), y: unpack(rows, 'y1'), z: unpack(rows, 'z1'), text:unpack(rows,'name1'),
	mode: 'markers',
    name: 'Nouns',
	marker: {
		size: 6,
		line: {
		color: 'rgba(217, 217, 217, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};

var trace2 = {
	x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'), text:unpack(rows,'name2'),
	mode: 'markers',
    name: 'Verbs',
	marker: {
		size: 6,
		symbol: 'circle',
		line: {
		color: 'rgba(255,55,49,0.4)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'
};

var trace3 = {
    x:unpack(rows, 'x3'), y: unpack(rows, 'y3'), z: unpack(rows, 'z3'), text:unpack(rows,'name3'),
	mode: 'markers',
    name: 'Adjectives',
	marker: {
		size: 6,
		symbol: 'circle',
		line: {
		color: 'rgba(94,152,49,0.4)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'
};

var trace4 = {
    x:unpack(rows, 'x4'), y: unpack(rows, 'y4'), z: unpack(rows, 'z4'),text:unpack(rows,'name4'),
	mode: 'markers',
    name: 'Adverbs',
	marker: {
		size: 6,
		symbol: 'circle',
		line: {
		color: 'rgb(192,84,255,1)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'
};


var trace5 = {
    x: xCenters, y: yCenters, z: zCenters,
	mode: 'markers',
    name: 'Cluster Centers',
	marker: {
		size: 6,
		symbol: 'circle',
		line: {
		color: 'rgb(192,84,255,1)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'
};


//All the traces are added to an array called data, which is graphed using Plotly.newPlot();

var data = [trace1,trace2,trace3,trace4,trace5];
var layout = {margin: {
	l: 0,
	r: 0,
	b: 0,
	t: 0
  }};
Plotly.newPlot('tester', data, layout);});