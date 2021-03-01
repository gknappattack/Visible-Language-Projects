/*
The Chart drawing is all done through Highcharts Javascript library. The documentation for
all the various chart types can be found here: https://api.highcharts.com/highcharts/

This javascript file is linked to packedbubbles.html and controls the drawing of the packed
bubble charts. The javascript to draw the tree charts is found in the treecharts.htmnl file, not
a separate js file. I intended to separate it from the html, but never reached that point.
*/

//Global variable to store the data for the current chart so it can be easily redrawn/filtered
var currentChart;

//Default the chart to draw the Nephi1 data when started
var currentDataSet = "nephi1"; 

//Global variable tracking which chart type is being displayed (which button is selected)
var currChartType = "";

//Main Graph Creation functions

//Each function calls createChart with the chart type so the correct data set is retrieved
//then is drawn using the Highcharts API
function createContentChart() {
    resetDisplay();

    var chartData = createChart("content");
    currChartType = "content";
    currentChart = chartData;

    Highcharts.chart('graph-display', chartData); 
}

function createFunctionChart() {
    resetDisplay();

    var chartData = createChart("function");
    currChartType = "function";
    currentChart = chartData;

    Highcharts.chart('graph-display', chartData); 
  }

function createThemeChart() {
    resetDisplay();

    var chartData = createChart("theme");
    currChartType = "theme";
    currentChart = chartData;

    Highcharts.chart('graph-display', chartData); 
}


//Data handling functions
function createChart(chartType) {
    var titleCase = fixCapital(chartType);
    var speakerName = fixCapital(currentDataSet);


    //chart is a JSON object containing the settings from the Highcharts API
    //The two most important sections are the series: { events: } tag and the
    //series: getData() function call.
    var chart = {
        chart: {
            type: 'packedbubble',
            height: '800',
            width: '1700'
        },
        title: {
            text: titleCase + ' words spoken by ' + speakerName + ' in the Book of Mormon by part-of-speech'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}</b> appears {point.y} times'
        },
        plotOptions: {
        series: {
            cursor: 'pointer',
            events: {
                //Set an on-click listener for each of the bubbles to run "zoom-in" function for selected bubble
                click: function (event) {
                    var text = event.point.name;
                    var colorValue = event.point.color;
                    zoomIn(text, colorValue);
                }
            }
        },

            packedbubble: {
                useSimulation: false,
                minSize: '0%',
                maxSize: '100%',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 1
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal',
                        fontSize: 18,
                        crop: true
                    }
                }
            }
            
        },
        //Call getData to retrieve the correct data set from the server in json format.
        series: getData(chartType)
    };

    return chart;
}


function getData(chartType) {
    var data;

    //This is the link I stored the data to be retrieved from on my github. 
    //All the code in this section can be changed, as long as the json data to be displayed is retrieved and returned.
    let urlBase = "https://gknappattack.github.io/BookOfMormonBubbleCharts/json/";

    //Because Dr. Fields wants to display word frequencies in 3 different categories (content words, function words, word themes)
    //How I set up my files on github was to have a folder for each speaker, then within each folder, 3 files called content.json,
    //function.json and themes.json. Doing this allowed me to just pass in a variable for chart type and the speaker from the html page
    //And append that information to the url base and retrieve the correct file. This can all change, but those were the data specs that
    //Dr. Fields asked for, so just something to keep in mind. (every speaker has 3 different data sets)
    

    //TODO: Right now, it is making synchornous requests so the data didn't load too slow and fail to display,
    //but probably can be made asynchonous, would need some tweaking here.

    if (chartType == "content") {
        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);
    }
    else if (chartType == "function") {

        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);
    }
    else {
        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);

    }
    console.log(data);

    data = dataFiltering(data);
    
    console.log(data);

    return data
}

//Dr. Fields wanted the charts to be filtered by two parameters: part of speech and number of words to display
//This function takes in the original data set retrieved by getData() above, filters it based on input on the html page
//And returns it to getData to be displayed.
function dataFiltering(data) {
    
    //JSON object filtered by part of speech
    var cleanData;

    //Get picklist of values from html page
    var partOfSpeech = document.getElementById("wordparts").value;
    var wordnums = document.getElementById("wordnum").value;

    //Loop through each series inside data set to find matching part of speech data.
    for (var key in data) {
        var currArray = data[key];

        if (currArray.name == partOfSpeech) {
            cleanData = currArray;
            break;  
        }
    }


   if (cleanData == null) {
       
       return data;
    }
    else {
        
        var slicedArray;

        //Check for invalid or non-input for number filtering
        if (wordnums.length == 0 || wordnums > cleanData.data.length) {
            wordnums = cleanData.data.length;
        }

        //Slice part of speech filtered array to the number of words selected.
        slicedArray = cleanData.data.slice(0,wordnums);
        
        //Format for Highcharts and return
        var finalData = [{
            name: cleanData.name,
            data: slicedArray
        }]
        

        return finalData;
    }

}

//Function to run when a name of a speaker on the right sidebar is clicked.
function loadNewData(e) {
    currentDataSet = e.target.id;
    createContentChart();
}

//Function to run filtering options on the currently displayed chart when the Go button is clicked.
function goButton() {
    var partOfSpeech = document.getElementById("wordparts").value;

    //If no part of speech is specified, generate the graph the user is currently viewing with filters
    if (partOfSpeech == "All") {
        if (currChartType == "content") {
            createContentChart();
        }
        else if (currChartType == "function") {
            createFunctionChart();
        }
        //Default to content word chart if no chart has been created yet
        else if (currChartType.length == 0) {
            createContentChart();
        }
        else {
            createThemeChart();
        }
    }
    //Generate the correct chart based on the part of speech selected
    else {
        if (partOfSpeech == "Noun" || partOfSpeech == "Adjective" || partOfSpeech == "Verb" || partOfSpeech == "Adverb") {
            createContentChart();
        }
        else {
            createFunctionChart();
        }
    } 
}

//String editing for displaying the current speakers name taken from the html ids with proper capitalization
function fixCapital(string) {
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}


//Create "dataSet" using the information of a selected bubble. Part of the zoom-in functionality
function getEventData(event) {
    var dataObject = [{
        name: 'Selected Node',
        data: [{
            name: event.point.name,
            value: event.point.value
        }],
        color: event.point.color
    }];

    return dataObject;
}

//Function that runs when a bubble is clicked. Passes the data along to draw a circle on the screen.
function zoomIn(text, colorValue) {
    switchDisplay();
    drawCircle(text, colorValue);
}


//Formatting/Div displaying functions

//The way the page works is that there are two divs stacked on top of each other.
//One is the div containing the Highcharts chart display, the other is a nearly identical blank white div used
//to draw the zoomed-in circles. Because there is no built-in zoom-in/drill-down functionality to the Packed Bubbles API,
//we had to customize our own budget version. When a bubble is selected, switchDisplay() is called, which hides the highcharts div,
//and reveals the blank one. The data is then used to draw a bubble of similar color, containing the same information as the clicked on.
//When the back button or a chart button is clicked, the resetDisplay() function is called and the highcharts div appears again
//and the process resets. 

function redrawGraph() {
    resetDisplay();
    Highcharts.chart('graph-display', currentChart);
}

function switchDisplay() {
    var x = document.getElementById("graph-display");
    var backBtn = document.getElementById("back-button");

    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    if (window.getComputedStyle(backBtn).visibility === "hidden") {
        backBtn.style.visibility = 'visible';
        
    } else {
        backBtn.style.visibility = 'hidden';
    }
}

//Reset to the Highcharts div and hide the circle and back button
function resetDisplay() {
    var x = document.getElementById("graph-display");
    var circle = document.getElementById("circle");
    var returnBtn = document.getElementById("back-button");

    if (x.style.display === "none") {
        x.style.display = "block";
    }

    if (circle.style.display === "block") {
        circle.style.display = "none";
    } else {
        circle.style.display = "none";
    }
    if (window.getComputedStyle(returnBtn).visibility === 'visible') {
        returnBtn.style.visibility = 'hidden';
    }
}




//Zoomed-in Circle creation/management
function drawCircle(text, colorValue) {
    var x = document.getElementById("circle");
  if (x.style.display === "none") {

    //Set display properties of circle
    x.style.display = "block";
    var borderColor = ColorLuminance(colorValue, -.2);
    x.style.backgroundColor = ColorLuminance(colorValue,.1);
    x.style.border = "3pt solid " + borderColor;
    x.style.color = "black";
    x.style.margin = "0 auto";
    x.style.marginTop = "50px";

    //Set text values/quote and animation
    var quoteText = "\"A quote from the Book of Mormon would appear here\""
    var span = document.getElementById("text");
    span.innerHTML = "mind";
    span.style.display = "block";
    span.innerHTML = text + "<br><br> <marquee scrollamount=\"15\">" + quoteText + "</marquee>"; 
  } else {
    x.style.display = "none";
  }
}


//This function was an experiment to try and match the colors of the "zoomed-in" circle with the one on the original chart.
//For some reason, although its the same rgb value, the colors are not the same and I could not find in the Highcharts documentation
//Where the color element is treated (I'm sure it is in there and I was not careful enough). This function allows you to make slight
//adjustments to the brightness of the function based on the original hex value and a decimal between -1 and 1 indicating how much to change
//the color. It didn't result in a match and honestly can be deleted, but I kept it to avoid deleting it and causing random errors. 
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}