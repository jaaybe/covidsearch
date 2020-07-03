// global variables needed
var statesDict = {};
var pickedState = false;
var pickedCity = false;

// get reference to the table body and the buttons
var statesEl = document.querySelector('#states');
var citiesEl = document.querySelector('#cities');
var tbodyEl = document.querySelector('tbody');
var filterButton = document.querySelector('#subBtn');
var clearButton = document.querySelector('#clearBtn');

// utility function to display list of unique values
var uniqueValues = ((value, index, self) => self.indexOf(value) === index);

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
    .then(res => makeStatesDropDownList(res.data))
    .catch(err => {
	    console.log(err);
    });
};

// prepare drop-down list for states
var makeStatesDropDownList = (data) => {
    statesEl.innerHTML = '<option selected="selected" value="all">All states</option>';
    // append each state into the drop-down selection list
    data.forEach(item => {
        getCities(item.region.province, item.region.cities);
        var optionEl = document.createElement('option');
        optionEl.value = item.region.province;
        optionEl.textContent = item.region.province;
        statesEl.appendChild(optionEl);
    });
    makeCitiesDropDownList('all');
};

// prepare drop-down list for cities
var makeCitiesDropDownList = (state) => {
    var citiesToDisplay = [];
    if (state === 'all') {
        Object.values(statesDict).forEach(citiesArray => {
            citiesArray.forEach(city => citiesToDisplay.push(city));
        });
        citiesToDisplay = citiesToDisplay.filter(uniqueValues).sort();
    } else {
        citiesEl.innerHTML = '';
        citiesToDisplay = statesDict[state];
    }

    // append each city into the drop-down selection list
    citiesEl.innerHTML = '<option selected="selected" value="all">All cities</option>';
    citiesToDisplay.forEach(city => {
        var optionEl = document.createElement('option');
        optionEl.value = city;
        optionEl.textContent = city;
        citiesEl.appendChild(optionEl);
    });
};

// extract cities from a particular state and store in citiesList
var getCities = (state, cities) => {
    var citiesList = [];
    cities.forEach(city => citiesList.push(city.name));
    statesDict[state] = citiesList.sort();
};

// find state(s) for a selected city
var identifyState = (citySelected) => {
    var statesList = [];
    Object.entries(statesDict).forEach(entry => {
        entry[1].forEach(city => {
            if (city === citySelected) {
                statesList.push(entry[0]);
            }
        });
    });
    return statesList;
}

// function to narrow drop down list of cities upon selection of a state
var stateSelectionHandler = (event) => {
    event.preventDefault();
    pickedState = true;
    // get value from selected element
    var selectedState = statesEl.options[statesEl.selectedIndex].value;
    // adjust drop down for cities only if user had not already selected a city
    if (!pickedCity) {
        makeCitiesDropDownList(selectedState);
    }
};

// function to narrow drop down list of cities upon selection of a state
var citySelectionHandler = (event) => {
    event.preventDefault();
    pickedCity = true;
    // get value from selected element
    var selectedCity = citiesEl.options[citiesEl.selectedIndex].value;
    // adjust drop down for states only if user had not already selected a state
    if (!pickedState) {
        var correspondingStatesArr = identifyState(selectedCity);
        statesEl.innerHTML = '';
        correspondingStatesArr.forEach(state => {
            var optionEl = document.createElement('option');
            optionEl.value = state;
            optionEl.textContent = state;
            statesEl.appendChild(optionEl);
        });
    }
}

// function to filter covid data based on user selections
var searchClickHandler = (event) => {
    event.preventDefault();
    // grab the user's filters
    var inputState = statesEl.options[statesEl.selectedIndex].value;
    var inputCity = citiesEl.options[citiesEl.selectedIndex].value;
    console.log(inputCity, inputState);
};

getCovidData();
statesEl.addEventListener('change', stateSelectionHandler);
citiesEl.addEventListener('change', citySelectionHandler);
filterButton.addEventListener('click', searchClickHandler);