var mapEntryViewModel;

function MapEntryViewModel() {
    mapEntryViewModel = this;
    mapEntryViewModel.mapEntryList = ko.observableArray([]);
    mapEntries.forEach(function(mapEntry) {
        mapEntryViewModel.mapEntryList.push(new MapEntry(mapEntry));
    });
}

ko.applyBindings(new MapEntryViewModel());

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 55.6761,
            lng: 12.5683
        },
        zoom: 14
    });
    var infoWindow = new google.maps.InfoWindow({});
    var bounds = new google.maps.LatLngBounds();
    var service = new google.maps.places.PlacesService(map);

    mapEntryViewModel.mapEntryList().forEach(function(mapEntry) {
        mapEntry.queryMarkerPosition();
        mapEntry.addMarkerData(infoWindow);
        mapEntry.showMarker(bounds);
    });
    map.fitBounds(bounds);
}
