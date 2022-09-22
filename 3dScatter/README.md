# 3d Scatter Chart

## Overview
Honestly this one is still really rough and incomplete. 

The original mission was to create a 3d scatter plot with multiple sets of data, each identified by a distinct color, that could also draw an ellipsoid around the various data sets. 

In 2d that is not a hard thing to accomplish at all, but finding a library that allows you to plot all of that together is essentially impossible. In many hours of searching I found no remotely feasible way to accomplish this. I didn't express that opinion super strongly to Dr. Fields, but I did mention that it was not looking especially do-able. It's worth a shot, but this was a big hold up.

For that reason, the pages in this folder don't have any formatting/background to them, just the graph, since I was focused just on making the graph work.


## Notes

This is explained more in the javascript files, but there are actually two html files and two javascript files. index.html and scatter.js are based on the Higcharts API for 3d scatter plots (the same API as the packedbubbles/treecharst). While it works alright, it was very limited in options, especially when I was trying to make the ellipsoids happen. Because of this, I went looking for other options, and tried out plotly. I was still unsuccessful with the ellipsoids, but I thought it was overall better for the graphing/customizability. 

On top of that, while Highcharts is essentially JSON format within Javascript, the plotly library is much more like native Javascript, making it a lot easier to write and understand/add you own customizablity.

Since both options failed with the ellipsoids, I kept both in here for you to look at and decide what would be best, but my suggestion is the plotly route. 

The last spec for the charts is the ability to click and rotate them. Both page should already have this built in and working already, but in case they stopped working, just keep in mind that is a desired function of the graph.+
