var mapEntryViewModel;

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
    var infoWindow = new google.maps.InfoWindow({});
    var bounds = new google.maps.LatLngBounds();
    var placeService = new google.maps.places.PlacesService(map);
    var streetService = new google.maps.StreetViewService();
    mapEntryViewModel.mapEntryList().forEach(function(mapEntry) {
        mapEntry.initMarker(placeService, streetService, map, infoWindow, bounds);
    });
}
