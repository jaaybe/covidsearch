// function to fetch data for the plot
var fetchPlotData = (inputState, inputCity) => {
    var date = '';
    for (var i=1; i<31; i++) {
        // adjust date for next fetch
        date = moment().subtract(i, 'd').format('YYYY-MM-DD');
        // fetch covid data for that date, inputCity and inputState
        fetch(`https://covid-19-statistics.p.rapidapi.com/reports?iso=USA&region_province=${inputState}&city_name=${inputCity}&date=${date}`, {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
		        "x-rapidapi-key": "0963280af0msh0e5fedbfcf26176p193969jsndbe28f1cd420"
	        }
        })
        .then(response => response.json())
        .then(res => savePlotData(res.data[0]))
        .catch(err => console.log(err));
    }
    displayPlot();
};

// function to collect relevant plot data
var savePlotData = (dataObj) => {
    var dataPointObj = {};
    dataPointObj['date'] = dataObj.region.cities[0].date;
    dataPointObj['confirmed'] = dataObj.region.cities[0].confirmed;
    dataPointObj['deaths'] = dataObj.region.cities[0].deaths;
    plotData.push(dataPointObj);
};

// function to display the Plotly plot
var displayPlot = () => {
    console.log(plotData);
}