# Book of Mormon Timeline

## Overview

This one is about 70~75% complete, mostly lacking in the visual department. A few things make that a little more complicated than it should be, but for the most part this one is in an okay place.

Essentially, the timeline page displays a large set of pictures that Dr. Fields sent me of various speakers in the Book of Mormon. When a picture is clicked, lines that connect that speaker to other speakers in the Book of Mormon are drawn, connecting them all. These lines can be clicked, and a quote/description that is associated with that connection is displayed. Since it is a timeline, there should be dates with the speakers (there is not currently)
 
The current page is a mess of a solution using CSS to create a 9000+ px div of the 78 pictures that scrolls by dragging the mouse, along with a small sidebar on the right that displays information about the selected picture to the right. The pictures are small, but side bar on the right blows it up.


## Functionality 

I was not given any sort of data to base my work off of, so I chose to use CSV as my file type, with a format like the following: 

Starting ID,Outgoing ID,Line Type, Connection
34,38,0,Test Connection
36,38,0,Test Connection
38,39,0,Test Connection
38,48,0,Test Connection

Each of the pictures when they are draw is assigned an id, based on their chronological relation. (i.e. Brother of Jared is 1 because he is the first to appear, down to Moroni). The first column is the id of the picture used as the starting point for the line, the second one is the ending point. The third number is an arbitrary value I called Line Type. Dr. Fields wanted the ability to draw lines above or below the pictures, so when Line Type is 0, the line is drawn from the tops of the pictures, and is drawn from the bottom when it is not 0. The final value is a descriptor of the relationship between the connection. (i.e. Nephi -> Lemuel would say siblings, or something like that). 

By creating a file for each speaker, the page will retrieve the data for each speaker and draw the appropriate lines when they are clicked.

This main functionality already works for the most part, however its implementation may cause some problems to build on top of.

The code is commented, most of the confusion is will likely come from the drawLines function. Essentially, when the pictures are drawn on load, the coordinates of a point in the middle, just a little bit in from the top of the picture, and similar point from the bottom of the picture are saved to a Map, organized by id of the picture. When the data is parsed and two ids of pictures are read, the coordinates of these points is retrieved from the Map, and through some arbitrary calculations, a Bezier curve between the two points is made. The further the points, the taller the curver, so there is minimal overlap when many curves are drawn at once from or to one picture. 


The other confusing part of the whole set up: In order to dynamically draw and erase these lines, I used SVG and <path> elements to draw Bezier curves between connected pictures. This means that the background on display is an SVG element which makes it a little hard to do much with the background. If you try to add a picture to make the background more interesting/appealing, the z-value of the path elements will need to be edited to ensure that they are now not covered by the picture. If something disappears, it is likely a z-value issue.

## TODO List

- Mainly just visual rehaul. Again the browns and golds are terrible and I just didn't have time to worry about cleaning this up. 

- Time markings inside the timeline. The overall timeline effect with the scrolling and the paths is there, but there is no sort of time markings for the different speakers. It wouldn't need to be like every 100 years, but maybe a year marking at key transition points in the timeline. (part of the reason I didn't do it is because it would require me to sift through the years from the Book of Mormon which was pretty tedious, so this may require some boring work to determine all the dates).

