var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 55.6761,
            lng: 12.5683
        },
        zoom: 14
    });
    var infoWindow = new google.maps.InfoWindow({
        content: '123'
    });
    "MapEntryViewModel.Symbol(_latestValue)".forEach(function(mapEntry) {
        mapEntry.addMarkerData();
    });
}
