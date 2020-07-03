// global variables needed
var citiesList = [];

// get reference to the table body and the buttons
var statesEl = document.querySelector('#states');
var citiesEl = document.querySelector('#cities');
var tbodyEl = document.querySelector('tbody');
var filterButton = document.querySelector('#filter-btn');
var clearButton = document.querySelector('#clear-btn');

// get data from COVID api
var getCovidData = () => {
    fetch("https://covid-19-statistics.p.rapidapi.com/reports?iso=USA", {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
		    "x-rapidapi-key": "0963280af0msh0e5fedbfcf26176p193969jsndbe28f1cd420"
	    }
    })
    .then(response => response.json())
    .then(res => makeDropDownLists(res.data))
    .catch(err => {
	    console.log(err);
    });
};

// prepare drop-down lists for states and cities
var makeDropDownLists = (data) => {
    // append each state into the drop-down selection list
    data.forEach(item => {
        getCities(item.region.cities);
        var optionEl = document.createElement('option');
        optionEl.value = item.region.province;
        optionEl.textContent = item.region.province;
        statesEl.appendChild(optionEl);
    });
    // append each city into the drop-down selection list
    console.log(citiesList);
    citiesList.forEach(city => {
        var optionEl = document.createElement('option');
        optionEl.value = city;
        optionEl.textContent = city;
        citiesEl.appendChild(optionEl);
    });
};

// extract cities from a particular state and store in citiesList
var getCities = (cities) => {
    cities.forEach(city => {
        if (!(city.name in citiesList)) {
            citiesList.push(city.name);
        }
    })
};

getCovidData();