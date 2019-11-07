

const googleKey= 'AIzaSyB3NE69ANz_b5ciRwN0D8PalZYy353pqS4';
const reiKey = '200628408-d2c7675d25f67e96fe124c8597e49d47';
var mapCenterLat = ''; // global used to set map center
var mapCenterLng = ''; // global used to set map center
var maxDistance = ''; // global to set search radius
var maxResult = ''; // global to set max search results
let campArray = [];
let campInfo = [];
let trailsArray = [];
let trailsInfo = [];



function initMap() {

    const imageTent = 'images/tentIcon.png';
    const imageTrail = 'images/hikeIcon.png'
    let userInput = $('#userForm').val() + ',' + $('#states').val();
    let options = {
        zoom: 9,
        center: {lat: mapCenterLat, lng: mapCenterLng},
    }
    var map = new


    //setting marker for User origional search location
    google.maps.Map(document.getElementById('map'), options);

    let centerFlag = {lat: mapCenterLat, lng: mapCenterLng};
    let searchPoint = new google.maps.Marker({position: centerFlag, map: map});

    searchPoint.addListener('mouseover', function () {
        infoWindow = new google.maps.InfoWindow({content: userInput})
        infoWindow.open(map, this);
    })
    searchPoint.addListener('mouseout', () => infoWindow.close())


    // running through length of array setting camping points
    for (let i = 0; i < campArray.length; i++) {

        var markerCamp = new google.maps.Marker({position: campArray[i], map: map, icon: imageTent});

        var infoWindow = '';

        markerCamp.addListener('mouseover', function () {
            infoWindow = new google.maps.InfoWindow({content: campInfo[i].toString()});
            infoWindow.open(map, this);
        })
        markerCamp.addListener('mouseout', () => infoWindow.close())
    }


    // running through length of array setting camping points
    for (let i = 0; i < trailsArray.length; i++) {
        var markerTrail = new google.maps.Marker({position: trailsArray[i], map: map, icon: imageTrail},);


        var infoWindow = '';

        markerTrail.addListener('mouseover', function () {
            infoWindow = new google.maps.InfoWindow({content: trailsInfo[i].toString()});
            infoWindow.open(map, this);
        })
        markerTrail.addListener('mouseout', () => infoWindow.close())
    }

}




/* Places each key of lat and long of the campsite into an object initializing for google map marker
merging tails and campsite to push to map
*/
function campLocArr(campLocRei) {

    for (let i = 0; i < campLocRei.campgrounds.length; i++) {
        campArray[i] = {
            lat:campLocRei.campgrounds[i].latitude,
            lng:campLocRei.campgrounds[i].longitude,
        };

        campInfo[i] = campLocRei.campgrounds[i].name;
    }

    $(initMap()); // no parameters passed to next function because global was set to merge trails flow and camp flow
}




//trails flow
function trailsLocArr(trailsLocRei) {

    for (let i = 0; i < trailsLocRei.trails.length; i++) {

        trailsArray[i] = {
            lat:trailsLocRei.trails[i].latitude,
            lng:trailsLocRei.trails[i].longitude,
        };

        trailsInfo[i] = trailsLocRei.trails[i].name;
    }

    $(initMap());  // no parameters passed to next function because global was set to merge trails flow and camp flow
}




// printing Camp site results to DOM List
function displayCamp(campLoc) {
    $('.apiError').empty();

    if(campLoc.campgrounds.length >= 1){
        $('#campResultsList').append(`<h2>Camp Sites</h2>`);

    }else{
        $('#campResultsList').append(`<h4>No Campsites found in the area <br> Try Expanding your search.</h4>`);
    }


        for (let i = 0; i < campLoc.campgrounds.length; i++) {
            $('#campResultsList').append(`
        <li><h3><a href="${campLoc.campgrounds[i].url}">${campLoc.campgrounds[i].name}</a></h3>
        <img src="${campLoc.campgrounds[i].imgUrl}" alt="campsite picture" id="imageDetails" height="100" width="100">
        <section class="listings">
        <p id="details">Number of Campsites: ${campLoc.campgrounds[i].numCampsites}</p>
        <p id="details">Location: ${campLoc.campgrounds[i].latitude}, ${campLoc.campgrounds[i].longitude} </p>
        </section>
        </li>`)
        }

        $(campLocArr(campLoc));
}





//Trails flow
function displayTrail(trailsLoc) {
    $('.apiError').empty();

    if(trailsLoc.trails.length >= 1){
        $('#trailResultsList').append(`<h2>Trail Locations</h2>`);

    }else{
        $('#trailResultsList').append(`<h4>No trails found in the  area <br> Try Expanding your search.</h4>`);
    }

    for (let i = 0; i < trailsLoc.trails.length; i++) {
        $('#trailResultsList').append(`
        <li><h3><a href="${trailsLoc.trails[i].url}">${trailsLoc.trails[i].name}</a></h3>
        <img src="${trailsLoc.trails[i].imgSmall}" alt="trail picture" id="imageDetails" height="100" width="100">
        <section class="listings">
        <p id="details">Difficulty: ${trailsLoc.trails[i].difficulty}</p>
        <p id="details">Length: ${trailsLoc.trails[i].length} miles</p>
        <p id="details">Location: ${trailsLoc.trails[i].latitude}, ${trailsLoc.trails[i].longitude} </p>
        <p id="details">Stars: ${trailsLoc.trails[i].stars}</p>
        </section>
        </li>`)
    }

    $(trailsLocArr(trailsLoc));
}




// Get camping spot from REI API
function getCamp(lat,long) {

    var coordinateLat = lat;
    var coordinateLng = long;
    maxRad = '&maxDistance=' + maxDistance; // pulling from global
    maxHits = '&maxResults=' + maxResult;  // pulling from global
    const url = 'https://www.hikingproject.com/data/get-campgrounds?';

    const campSpot = url + 'lat='+ coordinateLat + '&' + 'lon=' + coordinateLng + maxRad + maxHits + '&key=' + reiKey;

    fetch(campSpot)
        .then(response => response.json())
        .then(responseJson => { // 35-38 print the json object to console
            console.log(responseJson);
            return responseJson;
        })
        .then(responseJson => displayCamp(responseJson)) // print to DOM
        .catch(error => {
            $(alert).text('Campgrounds is broken.')
        });
}




//Trails flow
function getTrail(lat,long) {
    var coordinateLat = lat;
    var coordinateLng = long;
    maxRad = '&maxDistance=' + maxDistance; // pulling from global
    maxHits = '&maxResults=' + maxResult;  // pulling from global
    const url = 'https://www.hikingproject.com/data/get-trails?';

    const trailSpot = url + 'lat='+ coordinateLat + '&' + 'lon=' + coordinateLng + maxRad + maxHits + '&key=' + reiKey;

    fetch(trailSpot)
        .then(response => response.json())
        .then(responseJson => { // 35-38 print the json object to console
            console.log(responseJson);
            return responseJson;
        })
        .then(responseJson => displayTrail(responseJson)) // print to DOM
        .catch(error => {
            $(alert).text('Trails is broken.')
        });
}




// finding lat long
function geoDegree(responseJson) {
    var coorLat = responseJson.results[0].geometry.location.lat;
    var coorLng = responseJson.results[0].geometry.location.lng; /* line 33,34 pulling separately
     because the REI API accepts a different format of Lat and Long than what google API provides */


    mapCenterLat = coorLat; // write to global var to carry to center the map
    mapCenterLng = coorLng; // write to global var to carry to center the map


    // getCamp(coorLat, coorLng); // Sending coordinates to REI endpoint for camping spots
    // getTrail(coorLat,coorLng); // Sending coordinates to REI endpoint for trail


    if ($('input[name="checkCamp"]').is(':checked') && $('input[name="checkTrail"]').is(':checked')) {
        $('#trailResultsList').empty();
        $('#campResultsList').empty();
        $('.trailResults, .campResults .mapResult').removeClass('hidden');
        getCamp(coorLat, coorLng); // Sending coordinates to REI endpoint for camping spots
        getTrail(coorLat,coorLng); // Sending coordinates to REI endpoint for trail

    } else if ($('input[name="checkTrail"]').is(':checked')) {
        $('#trailResultsList').empty();
        $('.trailResults, .mapResult').removeClass('hidden');
        getTrail(coorLat,coorLng);

    } else if ($('input[name="checkCamp"]').is(':checked')){
        $('#campResultsList').empty();
        $('.campResults, .mapResult').removeClass('hidden');
        getCamp(coorLat, coorLng);

    }else {
        alert('Please select the check box for campsites, trails, or both.');
    }

}





// convert address to lat long
function geoCode(city,state) {

    var location = 'address=' + city + '+' + state;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const geo = url + location + '&key=' + googleKey;

    fetch(geo)
        .then(response => response.json())
        .then(responseJson => { // 35-38 print the json object to console
            console.log(responseJson);
            return responseJson;
        })
        .then(responseJson => geoDegree(responseJson))
        .catch(error => {
            $(alert).text(`Google Geo error message: ${error.message}.`)
        });
}




function empty(){
    campArray = [];
    campInfo = [];
    trailsArray = [];
    trailsInfo = [];
    $('.apiError').empty();
    $('#trailResultsList').empty();
    $('#campResultsList').empty();
}





function start() {
    $('#searchForm').on('submit',function(e) {
        e.preventDefault();
        var city = $('#userForm').val();
        var state = $('#states').val();
        maxDistance = $('#radius').val(); // stored to global
        maxResult = $('#maxHit').val(); // stored to global
        $(empty());
        $('#introContainer').hide();
        $('.mapResult').removeClass('hidden');

        geoCode(city,state);
    })
}


$(start());