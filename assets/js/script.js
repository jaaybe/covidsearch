// global variables needed
var statesDict = {};
var pickedState = false;
var pickedCounty = false;
var inputLat = '';
var inputLon = '';
var plotData = [];

// get reference to the table body and the buttons
var statesEl = document.querySelector('#states');
var countiesEl = document.querySelector('#counties');
var searchHistoryEl = document.querySelector('#searchHistory');
var filterButtonEl = document.querySelector('#subBtn');
var delHistoryEl = document.querySelector('#delHistory');
var plotEl = document.querySelector('#plot');
var iframeMapEl = document.querySelector('#iframeMap');

// utility function to display list of unique values
var uniqueValues = ((value, index, self) => self.indexOf(value) === index);

// utility function to display array of unique objects
var uniqueHistory = (arr) => {
    var newArr = [];
    Object.entries(arr).forEach(entry => {
        var obj = entry[1];
        if (newArr.length === 0) {
            newArr.push({'county': obj.county, 'state': obj.state});
        }
        else {
            var found = newArr.some(el => (el.county === obj.county && el.state === obj.state));
            if (!found) {
                newArr.push({'county': obj.county, 'state': obj.state});
            }
        };
    });
    return newArr;
};

// retrieve search history
var searchHistoryArr = JSON.parse(localStorage.getItem('searchHistoryArr')) || [];

// function to populate the search history and save to local storage
var searchHistory = () => {
    // clear previous search history
    searchHistoryEl.innerHTML = '';
    // eliminate duplicates in searchHistoryArr
    searchHistoryArr = uniqueHistory(searchHistoryArr);
    // sort searchHistoryArr alphabetically by county
    searchHistoryArr.sort((a, b) => (a.county > b.county) ? 1 : -1);
    // loop through searchHistoryArr to display user search history
    searchHistoryArr.forEach(obj => {
        var countyStateEl = document.createElement('li');
        countyStateEl.setAttribute('class', 'list-group-item');
        countyStateEl.textContent = `${obj.county}, ${obj.state}`;
        searchHistoryEl.appendChild(countyStateEl);
    });
};
// get data from COVID api
var makeDropDownLists = () => {
    fetch("https://covid-19-statistics.p.rapidapi.com/reports?iso=USA", {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
		    "x-rapidapi-key": "0963280af0msh0e5fedbfcf26176p193969jsndbe28f1cd420"
	    }
    })
    .then(response => response.json())
    .then(res => makeStatesDropDownList(res.data))
    .catch(err => console.log(err));
};

// prepare drop-down list for states
var makeStatesDropDownList = (data) => {
    statesEl.innerHTML = '<option selected="selected" value="all">All states</option>';
    // append each state into the drop-down selection list
    data.forEach(obj => {
        getCounties(obj.region.province, obj.region.cities);
        var optionEl = document.createElement('option');
        optionEl.value = obj.region.province;
        optionEl.textContent = obj.region.province;
        statesEl.appendChild(optionEl);
    });
    makeCountiesDropDownList('all');
};

// extract counties from a particular state and store in countiesList
var getCounties = (state, counties) => {
    var countiesList = [];
    counties.forEach(county => countiesList.push(county.name));
    statesDict[state] = countiesList.sort();
};

// prepare drop-down list for counties
var makeCountiesDropDownList = (state) => {
    var countiesToDisplay = [];
    if (state === 'all') {
        Object.values(statesDict).forEach(countiesArray => {
            countiesArray.forEach(county => countiesToDisplay.push(county));
        });
        countiesToDisplay = countiesToDisplay.filter(uniqueValues).sort();
    } else {
        countiesEl.innerHTML = '';
        countiesToDisplay = statesDict[state];
    }

    // append each county into the drop-down selection list
    countiesEl.innerHTML = '<option selected="selected" value="all">All counties</option>';
    countiesToDisplay.forEach(county => {
        var optionEl = document.createElement('option');
        optionEl.value = county;
        optionEl.textContent = county;
        countiesEl.appendChild(optionEl);
    });
};

// find state(s) for a selected county
var identifyState = (countySelected) => {
    var statesList = [];
    Object.entries(statesDict).forEach(entry => {
        entry[1].forEach(county => {
            if (county === countySelected) {
                statesList.push(entry[0]);
            }
        });
    });
    return statesList;
};

// function to narrow drop down list of counties upon selection of a state
var stateSelectionHandler = (event) => {
    event.preventDefault();
    pickedState = true;
    // get value from selected element
    var selectedState = statesEl.options[statesEl.selectedIndex].value;
    // adjust drop down for counties only if user had not already selected a county
    if (!pickedCounty) {
        makeCountiesDropDownList(selectedState);
    }
};

// function to narrow drop down list of counties upon selection of a state
var countySelectionHandler = (event) => {
    event.preventDefault();
    pickedCounty = true;
    // get value from selected element
    var selectedCounty = countiesEl.options[countiesEl.selectedIndex].value;
    // adjust drop down for states only if user had not already selected a state
    if (!pickedState) {
        var correspondingStatesArr = identifyState(selectedCounty);
        statesEl.innerHTML = '';
        correspondingStatesArr.forEach(state => {
            var optionEl = document.createElement('option');
            optionEl.value = state;
            optionEl.textContent = state;
            statesEl.appendChild(optionEl);
        });
    }
};

// function to fetch covid data based on user selections (assuming we have only one county/state pair selected)
var searchClickHandler = (event) => {
    event.preventDefault();
    // grab the user's filters
    var inputState = statesEl.options[statesEl.selectedIndex].value;
    var inputCounty = countiesEl.options[countiesEl.selectedIndex].value;
    fetchCovidData(inputCounty, inputState);
    // display county and state in search history if not already there
    var inSearchHistory = false;
    searchHistoryArr.forEach(obj => {
        if (obj.county === inputCounty && obj.state === inputState) {
            return inThere = true;
        }
    });
    if (!inSearchHistory) {
        var newObj = {              // create new county/state pair
            county: inputCounty,
            state: inputState
        }
        searchHistoryArr.push(newObj); // add new county/state pair
        localStorage.setItem('searchHistoryArr', JSON.stringify(searchHistoryArr)); // save updated array
        searchHistory();   // display updated search history
    }
    clearFilters();
};

// function to fetch covid data for selected county/state pair
var fetchCovidData = (inputCounty, inputState) => {
    fetchPlotData(inputCounty, inputState);
    fetch(`https://covid-19-statistics.p.rapidapi.com/reports?iso=USA&region_province=${inputState}&city_name=${inputCounty}`, {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
		    "x-rapidapi-key": "0963280af0msh0e5fedbfcf26176p193969jsndbe28f1cd420"
	    }
    })
    .then(response => response.json())
    .then(res => displayCovidTable(res.data[0]))
    .catch(err => console.log(err));
};

// function to reset drop down lists
var clearFilters = () => {
    pickedState = false;
    pickedCounty = false;
    statesEl.innerHTML = '';
    countiesEl.innerHTML = '';
    makeDropDownLists();
};

// function to handle click on a county/state pair displayed in the search history
var searchHistoryClickHandler = event => {
    var countyState = event.target.textContent;
    var inputCounty = countyState.split(', ')[0];
    var inputState = countyState.split(', ')[1];
    fetchCovidData(inputCounty, inputState);
}

// function to clear the search history
var clearSearchHistory = () => {
    searchHistoryArr = [];
    localStorage.setItem('searchHistoryArr', JSON.stringify(searchHistoryArr));
    searchHistory();
};

// event listeners
statesEl.addEventListener('change', stateSelectionHandler);
countiesEl.addEventListener('change', countySelectionHandler);
filterButtonEl.addEventListener('click', searchClickHandler);
searchHistoryEl.addEventListener('click', searchHistoryClickHandler);
delHistoryEl.addEventListener('click', clearSearchHistory);

// fetch and display LA County covid data, prepare drop down lists and display search history stored in local storage upon opening the app
fetchCovidData('Los Angeles', 'California');
makeDropDownLists();
searchHistory();