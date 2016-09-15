var mapEntries = [{
    title: "Islands Brygge",
    description: "City harbor bath",
    id: 1,
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Kebabistan",
    description: "Nr.1 Vesterbro Shawarma",
    id: 2,
    tags: ['food', 'turkish', 'fastfood']
}, {
    title: "Riccos Fælledvej",
    description: "Nice café for studying.",
    id: 3,
    tags: ['café', 'coffee', 'study']
}, {
    title: "KB18",
    description: "House/Techno Club in the Meatpacking district",
    id: 4,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Culture Box",
    description: "The main House/Techno club in Copenhagen.",
    id: 5,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Boulevarden Bodega, Sønder Boulevard",
    description: "Bodega at Sønder Boulevard",
    id: 6,
    tags: ['bodega', 'billiard']
}];

var MapEntry = function(data) {
    this.title = data.title;
    this.description = data.description;
    this.id = data.id;
    this.tags = data.tags;
};

MapEntry.prototype.initMarker = function(service, map, infoWindow, bounds) {
    var self = this;

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.addQueryResultToObject(results[0]);
            self.addMarkerData(map, infoWindow);
            self.showMarker(map, bounds);
            map.fitBounds(bounds);
        }
    }
    var request = {
        query: self.title
    };
    service.textSearch(request, callback);
};

MapEntry.prototype.addQueryResultToObject = function(placeData) {
    this.location = placeData.geometry.location;
    this.formattedName = placeData.formatted_address;
};
// Since google maps api is loaded async, we need to call the addmarker from the mapInit callback function
MapEntry.prototype.addMarkerData = function(map, infoWindow) {
    var self = this;
    self.map = map;
    self.marker = new google.maps.Marker({
        title: self.title,
        animation: google.maps.Animation.DROP,
        id: self.id,
        position: self.location
    });
    self.infoWindow = infoWindow;
    self.marker.addListener('click', function() {
        self.populateInfoWindow();
    });
};

MapEntry.prototype.showMarker = function(map, bounds) {
    this.marker.setMap(this.map);
    bounds.extend(this.marker.position);
};

MapEntry.prototype.hideMarker = function() {
    this.marker.setMap(null);
};

MapEntry.prototype.populateInfoWindow = function() {
    if (this.infoWindow.marker != this.marker) {
        var self = this;
        this.infoWindow.marker = this.marker;
        this.infoWindow.setContent('<div>' + this.marker.title + '</div>');
        this.infoWindow.open(this.map, this.marker);
        this.infoWindow.addListener('closeclick', function() {
            self.infoWindow.setMarker(null);
        });
    }
};
