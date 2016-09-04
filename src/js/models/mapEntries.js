var copenhagenGeo = {
    lat: 55.6761,
    lng: 12.5683
};
var mapEntries = [{
    title: "Islands Brygge",
    description: "City harbor bath",
    location: copenhagenGeo,
    id: 1,
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Kebabistan",
    location: copenhagenGeo,
    id: 2,
    description: "Nr.1 Vesterbro Shawarma",
    tags: ['food', 'turkish', 'fastfood']
}, {
    title: "Riccos",
    location: copenhagenGeo,
    id: 3,
    description: "Nice café for studying.",
    tags: ['café', 'coffee', 'study']
}, {
    title: "KB18",
    location: copenhagenGeo,
    id: 4,
    description: "House/Techno Club in the Meatpacking district",
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Culture Box",
    location: copenhagenGeo,
    id: 5,
    description: "The main House/Techno club in Copenhagen.",
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Boulevarden",
    location: copenhagenGeo,
    id: 6,
    description: "Bodega at Sønder Boulevard",
    tags: ['bodega', 'billiard']
}];

var MapEntry = function(data) {
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.id = data.id;
    this.tags = data.tags;
    this.marker = {};
};

// Since google maps api is loaded async, we need to call the addmarker from the mapInit callback function
MapEntry.prototype.addMarkerData = function(infoWindow) {
    var self = this;
    self.marker = new google.maps.Marker({
        map: map,
        position: self.location,
        title: self.title,
        infoWindow: infoWindow,
        animation: google.maps.Animation.DROP,
        id: self.id
    });
    self.marker.addListener('click', function() {
        self.populateInfoWindow();
    });
};

MapEntry.prototype.populateInfoWindow = function() {
    if (this.infoWindow.marker != this.marker) {
        var self = this;
        this.infoWindow.marker = this.marker;
        this.infoWindow.setContent('<div>' + this.marker.title + '</div>');
        this.infoWindow.open(map, this.marker);
        this.infoWindow.addListener('closeclick', function() {
            self.infoWindow.setMarker(null);
        });
    }
};
