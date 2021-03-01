//Both this file and plotly.js handle the same set of data into a 3d scatter plot.
//This file uses the Highcarts 3d scatter API, which works fine, but has less customizability compared to
//Plotly. Since both are reasonable, I am leaving both files here to be worked on.

//The formatting of the file may look strange/confusing, but referring to the API documentation
//will be the easiest way to see what options are avaiable.

Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.2).get('rgb')]
            ]
        };
    })
});

// Set up the chart
var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'graph-container',
        margin: 100,
        type: 'scatter3d',
        animation: false,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                left: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 10
                },
                right: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 3
                },
                top: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 3
                },
                bottom: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 3
                },
                front: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 3
                },
                back: {
                    color: 'rgba(0, 0, 0, 0.0)',
                    visible: 'auto',
                    size: 3
                }
            }
        }
    },
    title: {
        text: 'Word Frequency Test'
    },
    tooltip: {
        pointFormat: '{point.name}<br><b>X</b>: {point.x}<br><b>Y</b>: {point.y}<br><b>Z</b>: {point.z}'
    },
    subtitle: {
        text: 'Click and drag the plot area to rotate in space'
    },
    plotOptions: {
        scatter: {
            width: 10,
            height: 10,
            depth: 10,
        }
    },
    yAxis: {
        title: {
            text:'Percentage of chapters containing word',
            enabled: true
        },
    },
    xAxis: {
        title: {
            text:'Raw Frequency Value',
            enabled: true
        },
        gridLineWidth: 1
    },
    zAxis: {
        showFirstLabel: true,
        title: {
            text:'Percentage of word',
            enabled: true
        }
    },
    legend: {
        enabled: true
    },
    series: [{
        name: 'Nouns',
        color: '#0066FF',
        data: [{
            x: 894,
            y: 12,
            z: 55,
            name: 'people'
        }, {
            x: 698,
            y: 8,
            z: 34,
            name: 'land'
        }, {
            x: 437,
            y: 20,
            z: 80,
            name: 'God'
        },{
            x: 350,
            y: 7,
            z: 45,
            name: 'king'
        },{
            x: 318,
            y: 18,
            z: 70,
            name: 'Lord'
        },{
            x: 278,
            y: 15,
            z: 60,
            name: 'Nephi'
        },{
            x: 261,
            y: 7,
            z: 33,
            name: 'words'
        },{
            x: 191,
            y: 6,
            z: 24,
            name: 'city'
        },{
            x: 188,
            y: 14,
            z: 32,
            name: 'Moroni'
        },{
            x: 164,
            y: 12,
            z: 42,
            name: 'men'
        },{
            x: 160,
            y: 14,
            z: 30,
            name: 'Ammon'
        },{
            x: 130,
            y: 11,
            z: 24,
            name: 'power'
        }],
        marker: {
            symbol: 'circle'
        }
    },{
        name: 'Verbs',
        color: '#000000',
        data: [{
            x: 1247,
            y: 80,
            z: 76,
            name: 'behold'
        }, {
            x: 830,
            y: 50,
            z: 55,
            name: 'it came to pass'
        }, {
            x: 397,
            y: 34,
            z: 66,
            name: 'come again'
        }],
        marker: {
            symbol: 'circle'
        }
    },{
        name: 'Adjectives',
        color: '#bd0009',
        data: [{
            x: 171,
            y: 22,
            z: 45,
            name: 'man'
        }],
        marker: {
            symbol: 'circle'
        }
    },{
        name: 'Adverbs',
        color: '#42eff5',
        data: [{
            x: 244,
            y: 50,
            z: 64,
            name: 'Alma'
        }],
        marker: {
            symbol: 'circle'
        }
    }]
});


//Add mouse and touch events for rotation
(function (H) {
    function dragStart(eStart) {
        eStart = chart.pointer.normalize(eStart);

        var posX = eStart.chartX,
            posY = eStart.chartY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            sensitivity = 5,  // lower is more sensitive
            handlers = [];

        function drag(e) {
            // Get e.chartX and e.chartY
            e = chart.pointer.normalize(e);

            chart.update({
                chart: {
                    options3d: {
                        alpha: alpha + (e.chartY - posY) / sensitivity,
                        beta: beta + (posX - e.chartX) / sensitivity
                    }
                }
            }, undefined, undefined, false);
        }

        function unbindAll() {
            handlers.forEach(function (unbind) {
                if (unbind) {
                    unbind();
                }
            });
            handlers.length = 0;
        }

        handlers.push(H.addEvent(document, 'mousemove', drag));
        handlers.push(H.addEvent(document, 'touchmove', drag));


        handlers.push(H.addEvent(document, 'mouseup', unbindAll));
        handlers.push(H.addEvent(document, 'touchend', unbindAll));
    }
    H.addEvent(chart.container, 'mousedown', dragStart);
    H.addEvent(chart.container, 'touchstart', dragStart);
} (Highcharts));
