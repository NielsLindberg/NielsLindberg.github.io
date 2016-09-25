var mapEntryViewModel;
var buttonPanorama = '<input id="show-panorama" type="button" value="Show Panorama">';
var panoramaDiv = '<div id="pano"></div>';
var buttonDirections = '<input id="show-directions" type="button" value="Show Directions">';

var themeColors = ['#e384a6', '#f4d499', '#4d90d6', '#c7e38c', '#9986c8', '#edf28c', '#ffd1d4', '#5ee1dc', '#b0eead', '#fef85a', '#8badd2'];
var categoryColors = {
    school: '#e384a6',
    food: '#f4d499',
    leasure: '#4d90d6',
    party: '#c7e38c',
};
var categoryColorsIcon = {
    school: 'e384a6',
    food: 'f4d499',
    leasure: '4d90d6',
    party: 'c7e38c',
};

function MapEntryViewModel() {
    mapEntryViewModel = this;
    mapEntryViewModel.entryList = ko.observableArray([]);
    mapEntries.forEach(function(entryData) {
        mapEntryViewModel.entryList.push(new ListEntry(entryData));
    });
}

ko.applyBindings(new MapEntryViewModel());

var mapEntryList = [];
mapEntries.forEach(function(entryData) {
    mapEntryList.push(new MapEntry(entryData));
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 55.6761,
            lng: 12.5683
        },
        zoom: 14,
        styles: styles
    });
    /* load the needed map services */
    var placeService = new google.maps.places.PlacesService(map);
    var streetService = new google.maps.StreetViewService();
    var directionsService = new google.maps.DirectionsService();

    var infoWindow = new google.maps.InfoWindow({});
    var bounds = new google.maps.LatLngBounds();

    mapEntryList.forEach(function(mapEntry) {
        mapEntry.initMarker(placeService, streetService, directionsService, map, infoWindow, bounds);
    });
}
