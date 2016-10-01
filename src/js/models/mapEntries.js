var mapEntries = [{
    title: "CBS, Solbjerg Campus",
    description: "The main campus of CBS",
    id: "A",
    category: 'school',
    tags: ['school', 'campus', 'cbs']
}, {
    title: "Harbor Bath, Islands Brygge",
    description: "City harbor bath",
    id: "B",
    category: 'leasure',
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Harbor Bath, Kalvebod Brygge",
    description: "City harbor bath",
    id: "C",
    category: 'leasure',
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    title: "Kebabistan, Istedgade",
    description: "Nr.1 Vesterbro Shawarma",
    id: "D",
    category: 'food',
    tags: ['food', 'turkish', 'fastfood']
}, {
    title: "Riccos Fælledvej",
    description: "Nice café for studying.",
    id: "E",
    category: 'leasure',
    tags: ['café', 'coffee', 'study']
}, {
    title: "KB18, Kødbyen",
    description: "House/Techno Club in the Meatpacking district",
    id: "F",
    category: 'party',
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Culture Box, Kronprinsessegade",
    description: "The main House/Techno club in Copenhagen.",
    id: "G",
    category: 'party',
    tags: ['music', 'club', 'techno', 'house']
}, {
    title: "Boulevarden Bodega, Sønder Boulevard",
    description: "Bodega at Sønder Boulevard",
    id: "H",
    category: 'party',
    tags: ['bodega', 'billiard']
}, {
    title: "Scarpetta, Rantzausgade",
    description: "Nice medium priced italian restaurant",
    id: "I",
    category: 'food',
    tags: ['food', 'italian', 'restaurant']
}, {
    title: "Five Star, Nørrebrogade",
    description: "Indian style durums",
    id: "I",
    category: 'food',
    tags: ['food', 'indian', 'fastfood']
}];

var Entry = function(data) {
    var self = this;
    this.title = data.title;
    this.description = data.description;
    this.id = data.id;
    this.category = data.category;
    this.tags = data.tags;
};

var ListEntry = function(data) {
    Entry.call(this, data);
    this.show = ko.observable(true);
};

ListEntry.prototype = Object.create(Entry.prototype);
ListEntry.prototype.constructor = ListEntry;

var MapEntry = function(data) {
    Entry.call(this, data);
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

MapEntry.prototype = Object.create(Entry.prototype);
MapEntry.prototype.constructor = MapEntry;

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
            self.addMarker();
            self.addMarkerListeners();
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
    var self = this;
    this.placeData = placeData;
    this.location = placeData.geometry.location;
    this.formattedName = placeData.formatted_address;
    this.icon = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' +
            self.id + '|' +
            vm.categoryIconColors[self.category] + '|' +
            '000000',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 32)
    };
};

MapEntry.prototype.addMarkerListeners = function() {
    var self = this;
    self.marker.addListener('click', function() {
        self.animateMarker();
        self.hidePanoramaView(self);
        self.hideDisplayDirections();
        self.populateInfoWindow();
    });
};

MapEntry.prototype.addMarker = function() {
    var self = this;
    this.marker = new google.maps.Marker({
        title: self.title,
        animation: google.maps.Animation.DROP,
        id: self.id,
        icon: self.icon,
        position: self.location,
        opacity: 0.9
    });
};

MapEntry.prototype.animateMarker = function() {

    /* Remove animation from all markers */
    vm.mapEntryList.forEach(function(mapEntry) {
        mapEntry.marker.setOpacity(0.9);
    });

    /* Activate animation on this marker if not active already */
    this.marker.setOpacity(1);
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
        this.infoWindow.setContent('<div id="infowindow">' + self.title + '</div>');
        this.infoWindow.marker = this.marker;
        this.infoWindow.open(this.map, this.marker);
        this.infoWindow.addListener('closeclick', function() {
            self.infoWindow.marker = null;
            self.marker.setOpacity(0.9);
            self.hideDisplayDirections();
            self.hidePanoramaView(self);
            self.unBindButtonsFromMarker();
        });
        this.unBindButtonsFromMarker();
        this.bindButtonsToMarker(self);
    }
};

MapEntry.prototype.unBindButtonsFromMarker = function() {
    $('.content-button').unbind('click');
    $('.content-button').css('display', 'none');
};

MapEntry.prototype.bindButtonsToMarker = function(self) {
    $('.content-button').css('display', 'block');
    $('#show-panorama').click(function() {
        self.hideDisplayDirections();
        self.createPanoramaView(self);
    });

    $('#show-directions').click(function() {
        self.hidePanoramaView(self);
        self.displayDirections(self);
    });
};

MapEntry.prototype.hidePanoramaView = function() {
    $('#pano').css('display', 'none');
};

MapEntry.prototype.hideDisplayDirections = function() {
    if (directionsDisplayList.length > 0) {
        directionsDisplayList.forEach(function(direction) {
            direction.setMap(null);
            direction.setDirections({ routes: [] });
        });
    }
    $('#directions').css('display', 'none');
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
    $('#pano').css({
        display: 'flex',
        flex: 1
    });
};

var directionsDisplayList = [];
MapEntry.prototype.displayDirections = function(self) {
    self.directionsService = new google.maps.DirectionsService();
    self.hideDisplayDirections();
    var origin = vm.mapEntryList[0].location;
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
                    strokeColor: '#282828'
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
    $('#directions').css({
        display: 'flex',
        flex: 1
    });
};
