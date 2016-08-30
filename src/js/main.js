var map;
var copenhagenGeo = {
    lat: 55.6761,
    lng: 12.5683
};
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: copenhagenGeo,
        zoom: 13
    });
}