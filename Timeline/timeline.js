var imageFiles = ["Brother_of_Jared","Shule","Omer", "Jared_Son_of_Omer","Daughter_of_Jared","Akish","Morianton",
                "Morianton_Maid_Servant", "Lib_1","Ether","Coriantumr","Gilead","Lib_2","Shiz","Lehi","Sariah","Nephi","Laman",
                "Lemuel","Laban","Zoram","Ishmael","Jacob_and_Joseph","Sherem","Enos","Mosiah","Benjamin","Zeniff","King_Laman",
                "Noah","Abinadi","Alma","Gideon","Amulon","Alma_Son_of_Alma","Nehor","Ammon","Aaron","Omner_and_Himni","Amlici",
                "Amnor","Limher","Manti","Zeram","Amulek","Zeezrom","Nephite_Daughters","Lamoni","Lamoni_Father","Abish",
                "Korihor","Captain_Moroni","Zerahemnah","Amalickiah","Lehonti","Teancum","Pahoran","Captain_Lehi","Ammoron",
                "Lamanite_Warrior","Jacob_Apostate","Pachus","Helaman","Paanchi","Kishkumen","Moronihah","Coriantumr_2",
                "Gadianton","Nephi_Son_of_Helaman","Seezoram","Seantum","Samuel","Giddianhi","Zemnarihah","Gidgiddoni",
                "Jesus","Ammaron","Mormon","Moroni"];


//Initialize containers for data read from CSV files
var linePairs = [];
var pathQuotes = new Map();
var imgNames = new Map();
var incomingConnections = [];
var outgoingConnections = [];

//Set necessary values to process image files
var imgIndex = 0;
var filePath = 'images/';
var fileType = ".jpg";

//Set constants and container for coordinates for line drawing
let coordinatesMap = new Map();
let topHeight = 320;
let botHeight = 440;


//Allow for horizontal drag and scrolling
const slider = document.querySelector('.main');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
});



loadImages();

//Function to draw the line of images across the center of the timeline div
function loadImages() {

    for (var i = 0; i < imageFiles.length; i++) {
        var imgString = filePath + imageFiles[i] + fileType;

        //Create the img element and set the same attributes
        var img = document.createElement("img");
        img.setAttribute("height", "160px");
        img.setAttribute("width", "110px");
        img.setAttribute("src", imgString);
        img.setAttribute("id", "img-" + i.toString());
        img.setAttribute("style", "cursor:pointer;");
        img.setAttribute("onclick","drawLines(this)");
        img.onclick = function() {drawLines(this);};

        //Create the div to place the picture inside of
        var newBox = document.createElement("div");
        newBox.setAttribute("class","item");
        newBox.setAttribute("id",i);

        newBox.appendChild(img);
        document.getElementById("timeline").appendChild(newBox);
        
        //Record the location of the picture to a Map for drawing lines
        var width = 95 + (118 * (i));
        coordinatesMap.set(i,[width,topHeight,botHeight]);

        //Create pretty string of name for image id to display on sidebar 
        var prettyImgName = imageFiles[i].replace(/_/g," ");
        imgNames.set(i,prettyImgName);
    }

}

//Function for retrieving data from the server and drawing the svg paths for the clicked image.
function drawLines(currImg) {
    linePairs = [];
    pathQuotes.clear();

    //Get the id number that was attached to the image id element
    var id = parseInt((currImg.id).substring(4));

    //Use the id from the img element to get the file name for paths to draw
    var imageString = imageFiles[id];

    //Retrieve CSV file with path data from server
    let request = new XMLHttpRequest();

    let url = "https://gknappattack.github.io/BookOfMormonBubbleCharts/timeline/" + imageString + ".txt";


    request.open('GET', url, false);
    request.onload = function() {
        if (request.readyState === 4) {

            //Split CSV files by lines
            var textData = request.response;
            var splitLines = textData.split(/\r|\n/);

            var lines = [];

            //Loop through each line
            for (var i = 1; i < splitLines.length - 1; i++) {
                var data = splitLines[i].split(',');
                var currLine = [];

                //Loop through values on the current line
                for (var j = 0; j <= 3; j++) {
                    
                    //Save id values for path drawing to array
                    if (j < 3) {
                        currLine.push(parseInt(data[j]));
                    }
                    //Get quotes/text associated with the path from final column
                    else {
                        pathQuotes.set(i-1,data[j]);
                    }
                }
                linePairs.push(currLine);
            }
            
        }
    };
    request.send(null);


    //Change the sidebar image to match selection
    changeSelectedImage(currImg);
    document.getElementById("path_connect").innerHTML = "None";

    //Call function to set the border on the clicked image
    resetHighlight();

    //Delete all previous lines and reset canvas
    $("#svg").empty();
    
    currImg.setAttribute("style","border:solid black 2pt;cursor:pointer");
    
    var ns = "http://www.w3.org/2000/svg";

    //TODO: Create a function that will read json for current speaker, and return set of path values
    
    //TODO: Loop through path values and create and append paths, maintain set of path ids to erase when deselected.
    for (var i = 0; i < linePairs.length; i++) {
        let currData = linePairs[i];

        //Get ID of two pictures to connect
        let firstImg = currData[0];
        let secondImg = currData[1];
        let lineType = currData[2];
        let pathID = pathQuotes.get(i);
        //console.log(pathID);

        //Get location coordinates from map
        let firstImgCoords = coordinatesMap.get(firstImg);
        let secondImgCoords = coordinatesMap.get(secondImg);
        let firstImgX = firstImgCoords[0];
        let secondImgX = secondImgCoords[0];

        //Calculate vertical offset of Bezier curve - The further apart the
        //two images are, the taller the curve should be
        var imageDistance = Math.abs(secondImg - firstImg);
        var curveOffSet = 40 + (4 * imageDistance);

        //Check if line is to be drawn from the top or bottom
        var imageHeight;
        var path = document.createElementNS(ns,"path");


        //Set coordinates for curve 
        //(M startX startY C startX startY+-off endX startY+-off endX endY)
        if (lineType == 0) { //Line type dictates if line is draw from top or bottom of picture
            imageHeight = firstImgCoords[1];

            var offSetHeight = imageHeight - curveOffSet;

            let pathString = "M " + firstImgX.toString() + " " + imageHeight.toString() + " C " + firstImgX.toString() + " " + offSetHeight.toString() + " " + secondImgX.toString() + " " + offSetHeight.toString() + " " + secondImgX.toString() + " " + imageHeight.toString();
            path.setAttributeNS(null, "d", pathString);

        }
        else { //If lineType value is 0, line is drawn from the top, else it is drawn from the bottom.
            imageHeight = firstImgCoords[2];


            var offSetHeight = imageHeight + curveOffSet;

            let pathString = "M " + firstImgX.toString() + " " + imageHeight.toString() + " C " + firstImgX.toString() + " " + offSetHeight.toString() + " " + secondImgX.toString() + " " + offSetHeight.toString() + " " + secondImgX.toString() + " " + imageHeight.toString();
            path.setAttributeNS(null, "d", pathString);
        }

        //Set attributes of the path including color and thickness
        path.setAttributeNS(null, "stroke", "black");
        path.setAttributeNS(null, "stroke-width", 4);
        var pathLength = (secondImgX - firstImgX) + 100;
        path.setAttributeNS(null, "stroke-dasharray",pathLength);
        path.setAttributeNS(null, "stroke-dashoffset",pathLength);
        path.setAttributeNS(null, "id", pathID);
        path.setAttributeNS(null, "onclick","getDescript(this)")

        //Draw new line
        document.getElementById("svg").appendChild(path);

    }

}

//Function to draw a border around a clicked picture to emphasize that it was chosen.
function resetHighlight() {
    for (var i = 0; i < imageFiles.length; i++) {
        var imgID = "img-" + i.toString();
        var currImg = document.getElementById(imgID);
        currImg.setAttribute("style","border:solid black 0pt;cursor:pointer");
    }
}

//Function that controls the image on the sidebar to the left. Uses the clicked picture's
//id to get the file from the image file array and display it in the top right.
function changeSelectedImage(selectedImg) {
    var id = parseInt((selectedImg.id).substring(4));
    console.log(id);

    var imageString = imageFiles[id];
    var imgFile = filePath + imageString + fileType;

    document.getElementById("selectedPerson").setAttribute("src",imgFile);
    document.getElementById("selected_name").innerHTML = imgNames.get(id);

    setConnections(selectedImg);
}

//Function that parses the data for the selected picture and determines which connections are incoming
//and which are outgoing. This is used to update the text on the right sidebar.
function setConnections(selectedImg) {
    var id = parseInt((selectedImg.id).substring(4));
    incomingConnections = [];
    outgoingConnections = [];
    var incomingCount = 0;
    var outgoingCount = 0;

    for (var i = 0; i < linePairs.length; i++) {
        let currData = linePairs[i];
        var startPoint = currData[0];
        var endPoint = currData[1];

        //This is an outgoing connection
        if (startPoint == id) {
            outgoingConnections[outgoingCount] = imgNames.get(endPoint);
            outgoingCount++;
        }
        //This is an incoming connection
        else if (endPoint == id) {
            incomingConnections[incomingCount] = imgNames.get(startPoint);
            incomingCount++;
        }
    }

    //Update text on sidebar with connections.
    if (incomingConnections.length > 0) {
        document.getElementById("incoming").innerText = incomingConnections.join(", ");
    }
    else {
        document.getElementById("incoming").innerText = "None";
    }
    
    if (outgoingConnections.length > 0) {
        document.getElementById("outgoing").innerText = outgoingConnections.join(", ");
    }
    else {
        document.getElementById("outgoing").innerText = "None";
    }
    
}

//Display the quote/text associated with the path that was saved as an id attribute for the path on the right side bar
function getDescript(selectedPath) {
    document.getElementById("path_connect").innerHTML = selectedPath.id;
}
