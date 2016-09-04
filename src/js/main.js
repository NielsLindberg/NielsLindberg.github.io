var map;
var copenhagenGeo = {
    lat: 55.6761,
    lng: 12.5683
};
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: copenhagenGeo,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        position: copenhagenGeo,
        map: map,
        title: "Copenhagen"
    });
    var infowindow = new google.maps.InfoWindow({
        content: 'copenhagen blablabla'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}