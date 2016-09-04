var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: copenhagenGeo,
        zoom: 14
    });
    var infowindow = new google.maps.InfoWindow({
        content: 'copenhagen blablabla'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}