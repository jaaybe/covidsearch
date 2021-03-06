// function to fetch data for the plot
var fetchPlotData = (inputCounty, inputState) => {
    // show spinner while data is being fetched for the plot
    showSpinner(spinnerPlotEl);
    // set up to retrieve and store 30 days worth of data in plotData array
    plotData = [];
    var date = '';
    for (var i=1; i<31; i++) {
        // adjust date for next fetch
        date = moment().subtract(i, 'd').format('YYYY-MM-DD');
        // fetch covid data for that date, inputCity and inputState
        fetch(`https://covid-19-statistics.p.rapidapi.com/reports?iso=USA&region_province=${inputState}&city_name=${inputCounty}&date=${date}`, {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
		        "x-rapidapi-key": "0963280af0msh0e5fedbfcf26176p193969jsndbe28f1cd420"
	        }
        })
        .then(response => response.json())
        .then(res => savePlotData(res))
        .catch(err => console.log(err));
    }
};

// function to collect relevant plot data
var savePlotData = (dataObj) => {
    var dataPointObj = {};
    dataPointObj['date'] = dataObj.data[0].region.cities[0].date;
    dataPointObj['confirmed'] = dataObj.data[0].region.cities[0].confirmed;
    dataPointObj['deaths'] = dataObj.data[0].region.cities[0].deaths;
    plotData.push(dataPointObj);
    if (plotData.length === 30) {
        displayPlot();
    }
};

// function to display the Plotly plot
var displayPlot = () => {
    // sort plotData by date
    plotData.sort((a, b) => {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
    });

    var dates = [];
    var confirmedCases = [];
    var deaths = [];
    plotData.forEach(obj => {
        dates.push(obj.date);
        confirmedCases.push(obj.confirmed);
        deaths.push(obj.deaths);
    });

    // create the traces
    var trace1 = {
        name: '# cases',
        x: dates,
        y: confirmedCases,
        mode: 'lines',
        line: {
            color: '#008891',
            width: 4
          },
    };
    var trace2 = {
        name: '# deaths',
        x: dates,
        y: deaths,
        yaxis: 'y2',
        mode: 'lines',
        line: {
            color: 'rgb(217, 83, 79)',
            width: 4
        }
    }

    // create the data array for the plot
    var data = [trace1, trace2];

    // define the plot layout
    var layout = {
        xaxis: {
            title: '30-DAY TREND',
            titlefont: {
                family: 'Montserrat, Arial, Helvetica, sans-serif',
                color: '#E7E7DE'
            },
            tickfont: {
                family: 'Montserrat, Arial, Helvetica, sans-serif',
                size: 14,
                color: '#E7E7DE'
            },
            showgrid: false,
            showline: true,
            linecolor: '#E7E7DE'
        },
        yaxis: {
            tickfont: {
                family: 'Montserrat, Arial, Helvetica, sans-serif',
                size: 14,
                color: '#E7E7DE'
            },
            showgrid: false,
            //showline: false,
            //gridcolor: '#E7E7DE',
            //zeroline: true,
            //zerolinecolor: '#E7E7DE'
        },
        yaxis2: {
            tickfont: {
                family: 'Montserrat, Arial, Helvetica, sans-serif',
                size: 14,
                color: 'rgb(217, 83, 79)'
            },
            tickformat: ',',
            anchor: 'x',
            overlaying: 'y',
            side: 'right',
            showgrid: false
            //showline: false,
            //gridcolor: '#E7E7DE',
            //zeroline: true,
            //zerolinecolor: '#E7E7DE'
        },
        legend: {
            x: 0,
            y: 1.1,
            orientation: 'h',
            font: {
                family: 'Montserrat, Arial, Helvetica, sans-serif',
                size: 12,
                color: '#E7E7DE'
            }
        },
        margin: {
            l: 40,
            r: 50,
            b: 50,
            t: 0,
            pad: 10
        },
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    var config = {
        scrollZoom: false,
        displaylogo: false,
        responsive: true,
        displayModeBar: false
    };

    // hide the spinner
    hideSpinner(spinnerPlotEl);
    // display the chart
    Plotly.newPlot('plot', data, layout, config);
};