var mapEntries = [{
    title: "Islands Brygge",
    description: "City harbor bath",
    location: {
        lat: 52.6761,
        lng: 13.5683
    },
    id: 1,
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Kebabistan",
    description: "Nr.1 Vesterbro Shawarma",
    location: {
        lat: 57.6761,
        lng: 10.5683
    },
    id: 2,
    tags: ['food', 'turkish', 'fastfood']
}, {
    title: "Riccos",
    description: "Nice café for studying.",
    location: {
        lat: 54.6761,
        lng: 13.5683
    },
    id: 3,
    tags: ['café', 'coffee', 'study']
}, {
    title: "KB18",
    description: "House/Techno Club in the Meatpacking district",
    location: {
        lat: 56.6761,
        lng: 11.5683
    },
    id: 4,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Culture Box",
    description: "The main House/Techno club in Copenhagen.",
    location: {
        lat: 53.6761,
        lng: 13.5683
    },
    id: 5,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Boulevarden",
    description: "Bodega at Sønder Boulevard",
    location: {
        lat: 55.6761,
        lng: 15.5683
    },
    id: 6,
    tags: ['bodega', 'billiard']
}];

var MapEntry = function(data) {
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.id = data.id;
    this.tags = data.tags;
};

// Since google maps api is loaded async, we need to call the addmarker from the mapInit callback function
MapEntry.prototype.addMarkerData = function(infoWindow) {
    var self = this;
    self.marker = new google.maps.Marker({
        map: map,
        position: self.location,
        title: self.title,
        animation: google.maps.Animation.DROP,
        id: self.id
    });
    self.infoWindow = infoWindow;
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
