var mapEntries = [{
    title: "Copenhagen Business School, Solbjerg Campus",
    description: "The main campus of CBS",
    id: 8,
    tags: ['school', 'campus', 'cbs']
}, {
    title: "Harbor Bath, Islands Brygge",
    description: "City harbor bath",
    id: 1,
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Harbor Bath, Kalvebod Brygge",
    description: "City harbor bath",
    id: 2,
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Kebabistan",
    description: "Nr.1 Vesterbro Shawarma",
    id: 3,
    tags: ['food', 'turkish', 'fastfood']
}, {
    title: "Riccos Fælledvej",
    description: "Nice café for studying.",
    id: 4,
    tags: ['café', 'coffee', 'study']
}, {
    title: "KB18",
    description: "House/Techno Club in the Meatpacking district",
    id: 5,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Culture Box",
    description: "The main House/Techno club in Copenhagen.",
    id: 6,
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Boulevarden Bodega, Sønder Boulevard",
    description: "Bodega at Sønder Boulevard",
    id: 7,
    tags: ['bodega', 'billiard']
}];

var MapEntry = function(data) {
    this.title = data.title;
    this.description = data.description;
    this.id = data.id;
    this.tags = data.tags;
    this.radius = 100;
    this.placeService = null;
    this.streetService = null;
    this.directionsService = null;
    this.map = null;
    this.infoWindow = null;
    this.panorama = null;
    this.directions = null;
    this.bounds = null;
};

MapEntry.prototype.initMarker = function(placeService, streetService, directionsService, map, infoWindow, bounds) {
    var self = this;
    this.placeService = placeService;
    this.streetService = streetService;
    this.directionsService = directionsService;
    this.map = map;
    this.infoWindow = infoWindow;
    this.bounds = bounds;

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.addQueryResultToObject(results[0]);
            self.addMarkerData();
            self.showMarker();
            self.map.fitBounds(self.bounds);
        }
    }
    var request = {
        query: self.title
    };
    placeService.textSearch(request, callback);
};

MapEntry.prototype.addQueryResultToObject = function(placeData) {
    this.placeData = placeData;
    this.location = placeData.geometry.location;
    this.formattedName = placeData.formatted_address;
};

// Since google maps api is loaded async, we need to call the addmarker from the mapInit callback function
MapEntry.prototype.addMarkerData = function() {
    var self = this;
    this.marker = new google.maps.Marker({
        title: self.title,
        animation: google.maps.Animation.DROP,
        id: self.id,
        position: self.location
    });
    self.marker.addListener('click', function() {
        self.populateInfoWindow();
    });
};

MapEntry.prototype.showMarker = function() {
    this.marker.setMap(this.map);
    this.bounds.extend(this.marker.position);
};

MapEntry.prototype.hideMarker = function() {
    this.marker.setMap(null);
};

MapEntry.prototype.populateInfoWindow = function() {
    if (this.infoWindow.marker != this.marker) {
        var self = this;
        this.infoWindow.setContent('<div id="infowindow"><div id="pano"></div><div id="directions"></div>' + buttonPanorama + buttonDirections + '</div>');
        this.infoWindow.marker = this.marker;
        this.infoWindow.open(this.map, this.marker);
        this.infoWindow.addListener('closeclick', function() {
            self.infoWindow.marker = null;
        });
        document.getElementById('show-panorama').addEventListener('click', function() {
            self.hideDisplayDirections();
            self.createPanoramaView(self);
        });
        document.getElementById('show-directions').addEventListener('click', function() {
            self.hidePanoramaView(self);
            self.displayDirections(self);
        });
    }
};

MapEntry.prototype.hidePanoramaView = function() {
    document.getElementById("pano").style.display = "none";
};

MapEntry.prototype.hideDisplayDirections = function() {
        if (directionsDisplayList.length > 0) {
        directionsDisplayList.forEach(function(direction) {
            direction.setMap(null);
            direction.setDirections({routes: []});
        });
    }
};

MapEntry.prototype.createPanoramaView = function(self) {
    self.streetService = new google.maps.StreetViewService();
    function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, self.marker.position);
            var panoramaOptions = {
                position: nearStreetViewLocation,
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
                pov: {
                    heading: heading,
                    pitch: 0
                }
            };

            self.panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        }
    }
    self.streetService.getPanoramaByLocation(self.marker.position, self.radius, getStreetView);
    document.getElementById("pano").style.display = "block";
};

var directionsDisplayList = [];
MapEntry.prototype.displayDirections = function(self) {
    self.directionsService = new google.maps.DirectionsService();
    self.hideDisplayDirections();
    var origin = mapEntryViewModel.mapEntryList()[0].location;
    var destinationAddress = self.location;
    var mode = 'TRANSIT';
    self.directionsService.route({
        origin: origin,
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: self.map,
                directions: response,
                draggable: false,
                polylineOptions: {
                    strokeColor: 'green'
                },
                markerOptions: {
                    visible: false
                },
                preserveViewport: true
            });
            directionsDisplay.setPanel(document.getElementById('directions'));
            directionsDisplayList.push(directionsDisplay);
            self.directions = directionsDisplay;
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};
