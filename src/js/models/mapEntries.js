var mapEntries = [{
    search: "CBS, Solbjerg Campus",
    title: "CBS, Solbjerg Campus",
    category: 'School',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Harbor Bath, Islands Brygge",
    title: "Harbor Bath, Islands Brygge",
    category: 'Bathing',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Harbor Bath, Kalvebod Brygge",
    title: "Harbor Bath, Kalvebod Brygge",
    category: 'Bathing',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Kebabistan, Istedgade",
    title: "Kebabistan",
    category: 'Fastfood',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Ricco's, Fælledvej",
    title: "Ricco's, Fælledvej",
    category: 'Café',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "KB18, Kødbyen",
    title: "KB18",
    category: 'Club',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Culture Box, Kronprinsessegade",
    title: "Culture Box",
    category: 'Club',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Boulevarden, Sønder Boulevard",
    title: "Boulevarden",
    category: 'Bodega',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Scarpetta, Rantzausgade",
    title: "Scarpetta",
    category: 'Restaurant',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Five Star, Nørrebrogade",
    title: "Five Star Shawarma",
    category: 'Fastfood',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Bolsjefabrikken, Ragnhildgade",
    title: "Bolsjefabrikken",
    category: 'Club',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Howitzvej 60",
    title: "CBS, IT Campus",
    category: 'School',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Pasta Mania, Elmegade",
    title: "Pasta Mania",
    category: 'Fastfood',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Liban Cuisine, Rantzausgade",
    title: "Liban Cuisine",
    category: 'Fastfood',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Diligencen, Korsgade",
    title: "Diligencen",
    category: 'Bodega',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Søhesten, Sølvgade",
    title: "Søhesten",
    category: 'Bodega',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}, {
    search: "Amager Strandpark",
    title: "Amager Beachpark",
    category: 'Bathing',
    foursquare: '4d46ad8c7e2e5481dac5758f'
}];

var Entry = function(data, id) {
    var self = this;
    this.title = data.title;
    this.search = data.search;
    this.id = id;
    this.category = data.category;
    this.foursquare = data.foursquare;
};

var ListEntry = function(data, id) {
    Entry.call(this, data, id);
};

ListEntry.prototype = Object.create(Entry.prototype);
ListEntry.prototype.constructor = ListEntry;

var MapEntry = function(data, id) {
    Entry.call(this, data, id);
    this.radius = 100;
    this.placeService = null;
    this.streetService = null;
    this.directionsService = null;
    this.map = null;
    this.foundPlace = null;
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
    var attempts = 1;

    function callback(results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.addQueryResultToObject(results[0]);
            self.addMarker();
            self.addMarkerListeners();
            self.showMarker();
            self.map.fitBounds(self.bounds);
            self.foundPlace = true;
        } else if (attempts < 120) {
            setTimeout(function() {
                attempts++;
                placeService.textSearch(request, callback);
            }, 100);
            self.foundPlace = false;
        } else {
            self.foundPlace = false;
        }
    }
    var request = {
        query: self.search,
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
        this.infoWindow.setContent('<div id="infowindow">' + self.title + '</div>');
        this.infoWindow.marker = this.marker;
        this.infoWindow.open(this.map, this.marker);
        this.infoWindow.addListener('closeclick', function() {
            self.closeInfoWindowEvents();
        });
        this.unBindButtonsFromMarker();
        this.bindButtonsToMarker(self);
    }
};

MapEntry.prototype.closeInfoWindowEvents = function() {
    this.infoWindow.marker = null;
    this.hideDisplayDirections();
    this.hidePanoramaView(this);
    this.hideFacebookView();
    this.unBindButtonsFromMarker();
};

MapEntry.prototype.unBindButtonsFromMarker = function() {
    $('.content-button').unbind('click');
    $('.content-button').css('display', 'none');
};

MapEntry.prototype.bindButtonsToMarker = function(self) {
    $('.content-button').css('display', 'block');
    $('#show-panorama').click(function() {
        self.hideDisplayDirections();
        self.hideFacebookView();
        self.createPanoramaView(self);
    });

    $('#show-directions').click(function() {
        self.hidePanoramaView(self);
        self.hideFacebookView();
        self.displayDirections(self);
    });
    $('#show-facebook').click(function() {
        self.hidePanoramaView(self);
        self.hideDisplayDirections();
        self.createFacebookView();
    });

};

MapEntry.prototype.hidePanoramaView = function() {
    $('#pano').css('display', 'none');
};

MapEntry.prototype.hideFacebookView = function() {
    $('#facebook').css('display', 'none');
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


MapEntry.prototype.createFacebookView = function() {
    $(document).ready(function() {
        var accessToken = {
            access_token: '1796256433992124|I4R9ZDFj8C2XuzB0LXMqXm3VRe0'
        };
        $.ajaxSetup({
            cache: true
        });
        $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
            FB.init({
                appId: '{1796256433992124}',
                version: 'v2.7' // or v2.1, v2.2, v2.3, ...
            });
            FB.api('/CopenhagenBusinessSchool?fields=id,name,description', function(response) {
                console.log(response);
            }, accessToken);
        });
    });
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
