var mapEntryViewModel;
var buttonPanorama = '<input id="show-panorama" type="button" value="Show Panorama">';
var panoramaDiv = '<div id="pano"></div>';
var buttonDirections = '<input id="show-directions" type="button" value="Show Directions">';


function MapEntryViewModel() {
    mapEntryViewModel = this;
    mapEntryViewModel.mapEntryList = ko.observableArray([]);
    mapEntries.forEach(function(mapEntry) {
        mapEntryViewModel.mapEntryList.push(new MapEntry(mapEntry));
    });
}

ko.applyBindings(new MapEntryViewModel());

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

    mapEntryViewModel.mapEntryList().forEach(function(mapEntry) {
        mapEntry.initMarker(placeService, streetService, directionsService, map, infoWindow, bounds);
    });
}
