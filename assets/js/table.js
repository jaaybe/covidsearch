var displayCovidTable = (dataObj) => {
    // extract lat and lon for maps purposes
    console.log(dataObj);


    var countyName = dataObj.region.cities[0].name + ' County';
    var geocoder = new google.maps.Geocoder();

    
    geocoder.geocode({ address: countyName }, function(results, status) {
       if (status === 'OK') {
        inputLat = results[0].geometry.location.lat();
        inputLon = results[0].geometry.location.lng();
        iframeMapEl.setAttribute('src', 'maps.html?lat='+ inputLat + '&lon=' + inputLon);
       } else {
        inputLat = dataObj.region.cities[0].lat;
        inputLon = dataObj.region.cities[0].long;
        iframeMapEl.setAttribute('src', 'maps.html?lat='+ inputLat + '&lon=' + inputLon);
       }
    })

    /********** TABLE BUILDING **********/
    // clear previous content
    var tableResultsDivEl = document.createElement('div');
    tableResultsDivEl.setAttribute('class', 'card-body mt-0');
    // set title
    var locationSearchedEl = document.createElement('h5');
    locationSearchedEl.setAttribute('class', 'card-title mt-4 mb-4');
    locationSearchedEl.textContent = `${dataObj.region.cities[0].name} county, ${dataObj.region.province}`;
    tableResultsDivEl.appendChild(locationSearchedEl);
    // set subtitle
    var lastUpdateEl = document.createElement('h6');
    lastUpdateEl.setAttribute('class', 'card-subtitle mb-4');
    lastUpdateEl.textContent = `Last update: ${dataObj.region.cities[0].date}`;
    tableResultsDivEl.appendChild(lastUpdateEl);
    // set table
    //var divEl = document.createElement('table');
    //divEl.setAttribute('class', 'table-responsive mb-5');
    var tableEl = document.createElement('table');
    tableEl.setAttribute('class', 'table table-sm');
    // table head
    var tableHeadEl = document.createElement('thead');
    var tHeadTrEl = document.createElement('tr');
    var tHeadTh1El = document.createElement('th');
    tHeadTh1El.setAttribute('scope', 'col');
    tHeadTrEl.appendChild(tHeadTh1El);
    var tHeadTh2El = document.createElement('th');
    tHeadTh2El.setAttribute('scope', 'col');
    //tHeadTh2El.textContent = dataObj.region.cities[0].name;
    tHeadTh2El.textContent = 'COUNTY';
    tHeadTrEl.appendChild(tHeadTh2El);
    var tHeadTh3El = document.createElement('th');
    tHeadTh3El.setAttribute('scope', 'col');
    //tHeadTh3El.textContent = dataObj.region.province;
    tHeadTh3El.textContent = 'STATE';
    tHeadTrEl.appendChild(tHeadTh3El);
    tableHeadEl.appendChild(tHeadTrEl);
    tableEl.appendChild(tableHeadEl);
    // table body
    var tableBodyEl = document.createElement('tbody');
    // row 1
    var tBodyTr1El = document.createElement('tr');
    var tBodyTr1ThEl = document.createElement('th');
    tBodyTr1ThEl.setAttribute('scope', 'row');
    tBodyTr1ThEl.setAttribute('data-toggle', 'tooltip');
    tBodyTr1ThEl.setAttribute('data-placement', 'bottom');
    tBodyTr1ThEl.setAttribute('title', 'total nb of cases so far');
    tBodyTr1ThEl.textContent = '# cases';
    tBodyTr1El.appendChild(tBodyTr1ThEl);
    var tBodyTr1CountyEl = document.createElement('td');
    tBodyTr1CountyEl.textContent = parseInt(dataObj.region.cities[0].confirmed).toLocaleString('en');
    tBodyTr1El.appendChild(tBodyTr1CountyEl);
    var tBodyTr1StateEl = document.createElement('td');
    tBodyTr1StateEl.textContent = parseInt(dataObj.confirmed).toLocaleString('en');
    tBodyTr1El.appendChild(tBodyTr1StateEl);
    tableBodyEl.appendChild(tBodyTr1El);
    // row 2
    var tBodyTr2El = document.createElement('tr');
    var tBodyTr2ThEl = document.createElement('th');
    tBodyTr2ThEl.setAttribute('scope', 'row');
    tBodyTr2ThEl.setAttribute('data-toggle', 'tooltip');
    tBodyTr2ThEl.setAttribute('data-placement', 'bottom');
    tBodyTr2ThEl.setAttribute('title', 'nb more (less) cases from the previous day');
    tBodyTr2ThEl.textContent = 'Δ cases';
    tBodyTr2El.appendChild(tBodyTr2ThEl);    
    var tBodyTr2CountyEl = document.createElement('td');
    tBodyTr2CountyEl.textContent = parseInt(dataObj.region.cities[0].confirmed_diff).toLocaleString('en');
    tBodyTr2El.appendChild(tBodyTr2CountyEl);
    var tBodyTr2StateEl = document.createElement('td');
    tBodyTr2StateEl.textContent = parseInt(dataObj.confirmed_diff).toLocaleString('en');
    tBodyTr2El.appendChild(tBodyTr2StateEl);
    tableBodyEl.appendChild(tBodyTr2El);
    // row 3
    var tBodyTr3El = document.createElement('tr');
    var tBodyTr3ThEl = document.createElement('th');
    tBodyTr3ThEl.setAttribute('scope', 'row');
    tBodyTr3ThEl.setAttribute('data-toggle', 'tooltip');
    tBodyTr3ThEl.setAttribute('data-placement', 'bottom');
    tBodyTr3ThEl.setAttribute('title', 'total nb of deaths so far');
    tBodyTr3ThEl.textContent = '# deaths';
    tBodyTr3El.appendChild(tBodyTr3ThEl);
    var tBodyTr3CountyEl = document.createElement('td');
    tBodyTr3CountyEl.textContent = parseInt(dataObj.region.cities[0].deaths).toLocaleString('en');
    tBodyTr3El.appendChild(tBodyTr3CountyEl);
    var tBodyTr3StateEl = document.createElement('td');
    tBodyTr3StateEl.textContent = parseInt(dataObj.deaths).toLocaleString('en');
    tBodyTr3El.appendChild(tBodyTr3StateEl);
    tableBodyEl.appendChild(tBodyTr3El);
    // row 4
    var tBodyTr4El = document.createElement('tr');
    var tBodyTr4ThEl = document.createElement('th');
    tBodyTr4ThEl.setAttribute('scope', 'row');
    tBodyTr4ThEl.setAttribute('data-toggle', 'tooltip');
    tBodyTr4ThEl.setAttribute('data-placement', 'bottom');
    tBodyTr4ThEl.setAttribute('title', 'nb more (less) deaths from the previous day');
    tBodyTr4ThEl.textContent = 'Δ deaths';
    tBodyTr4El.appendChild(tBodyTr4ThEl);    
    var tBodyTr4CountyEl = document.createElement('td');
    tBodyTr4CountyEl.textContent = parseInt(dataObj.region.cities[0].deaths_diff).toLocaleString('en');
    tBodyTr4El.appendChild(tBodyTr4CountyEl);
    var tBodyTr4StateEl = document.createElement('td');
    tBodyTr4StateEl.textContent = parseInt(dataObj.deaths_diff).toLocaleString('en');
    tBodyTr4El.appendChild(tBodyTr4StateEl);
    tableBodyEl.appendChild(tBodyTr4El);
    // row 5
    var tBodyTr5El = document.createElement('tr');
    var tBodyTr5ThEl = document.createElement('th');
    tBodyTr5ThEl.setAttribute('scope', 'row');
    tBodyTr5ThEl.textContent = 'Fatality rate';
    tBodyTr5El.appendChild(tBodyTr5ThEl);
    var tBodyTr5CountyEl = document.createElement('td');
    var fatalityRateCounty = parseInt(dataObj.region.cities[0].deaths) / parseInt(dataObj.region.cities[0].confirmed);
    tBodyTr5CountyEl.textContent = `${(fatalityRateCounty * 100).toFixed(2)} %`;
    tBodyTr5El.appendChild(tBodyTr5CountyEl);
    var tBodyTr5StateEl = document.createElement('td');
    tBodyTr5StateEl.textContent = `${(dataObj.fatality_rate * 100).toFixed(2)} %`;
    tBodyTr5El.appendChild(tBodyTr5StateEl);
    tableBodyEl.appendChild(tBodyTr5El);    
    // append to table divs
    tableEl.appendChild(tableBodyEl);
    //divEl.appendChild(tableEl);
    //tableResultsDivEl.appendChild(divEl);
    tableResultsDivEl.appendChild(tableEl);
    tableResultsEl.appendChild(tableResultsDivEl);
};