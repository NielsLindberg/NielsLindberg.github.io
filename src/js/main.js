var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: copenhagenGeo,
        zoom: 14
    });
    var infoWindow = new google.maps.InfoWindow({
        content: ''
    });
    MapEntryViewModel["Symbol(_latestValue)"].forEach(function(mapEntry) {
        mapEntry.addMarkerData();
    });
}