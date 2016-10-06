var mapEntries = [{
    search: "CBS, Solbjerg Campus",
    title: "CBS, Solbjerg Campus",
    category: 'School',
}, {
    search: "Harbor Bath, Islands Brygge",
    title: "Harbor Bath, Islands Brygge",
    category: 'Bathing',
    yelp: 'havnebadet-islands-brygge-københavn-s'
}, {
    search: "Harbor Bath, Kalvebod Brygge",
    title: "Harbor Bath, Kalvebod Brygge",
    category: 'Bathing',
    yelp: 'kalvebod-bølge-københavn'
}, {
    search: "Kebabistan, Istedgade",
    title: "Kebabistan",
    category: 'Fastfood',
    yelp: 'kebabistan-københavn'
}, {
    search: "Ricco's, Fælledvej",
    title: "Ricco's, Fælledvej",
    category: 'Café',
}, {
    search: "KB18, Kødbyen",
    title: "KB18",
    category: 'Club',
    yelp: 'kb18-københavn-v'
}, {
    search: "Culture Box, Kronprinsessegade",
    title: "Culture Box",
    category: 'Club',
    yelp: 'culture-box-københavn-2'
}, {
    search: "Boulevarden, Sønder Boulevard",
    title: "Boulevarden",
    category: 'Bodega',
}, {
    search: "Scarpetta, Rantzausgade",
    title: "Scarpetta",
    category: 'Restaurant',
    yelp: 'scarpetta-københavn-n'
}, {
    search: "Five Star, Nørrebrogade",
    title: "Five Star Shawarma",
    category: 'Fastfood',
    yelp: 'five-star-shawarma-københavn'
}, {
    search: "Bolsjefabrikken, Ragnhildgade",
    title: "Bolsjefabrikken",
    category: 'Club',
    yelp: 'bolsjefabrikken-københavn-ø'
}, {
    search: "Howitzvej 60",
    title: "CBS, IT Campus",
    category: 'School',
}, {
    search: "Pasta Mania, Elmegade",
    title: "Pasta Mania",
    category: 'Fastfood',
    yelp: 'pasta-mania-københavn-n'
}, {
    search: "Liban Cuisine, Rantzausgade",
    title: "Liban Cuisine",
    category: 'Fastfood',
    yelp: 'liban-cuisine-københavn'
}, {
    search: "Diligencen, Korsgade",
    title: "Diligencen",
    category: 'Bodega',
    yelp: 'diligencen-københavn-n'
}, {
    search: "Amager Strandpark",
    title: "Amager Beachpark",
    category: 'Bathing',
    yelp: 'amager-strandpark-københavn-s'
}];

var directionsDisplayList = [];

var Entry = function(data, id) {
    var self = this;
    this.title = data.title;
    this.search = data.search;
    this.id = id;
    this.category = data.category;
    this.yelp = data.yelp;
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
        self.onItemSelectClearEvents();
        self.populateInfoWindow();
        $('#result-title').text(self.title);
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
            self.onItemSelectClearEvents();
            $('#result-title').text(data.title);
        });
        this.bindButtonsToMarker(self);
    }
};

MapEntry.prototype.unBindButtonsFromMarker = function() {
    $('.content-button').unbind('click');
    $('.content-button').css('display', 'none');
};

MapEntry.prototype.bindButtonsToMarker = function(self) {
    self.hideContentViews();
    $('.content-button').css('display', 'block');
    $('#show-panorama').click(function() {
        self.hideContentViews();
        self.createPanoramaView(self);
    });

    $('#show-directions').click(function() {
        self.hideContentViews();
        self.displayDirections(self);
    });
    $('#show-yelp').click(function() {
        self.hideContentViews();
        self.createYelpView();
    });

};

MapEntry.prototype.hidePanoramaView = function() {
    $('#pano').css('display', 'none');
};

MapEntry.prototype.hideYelpView = function() {
    $('#yelp').css('display', 'none');
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

MapEntry.prototype.hideContentViews = function() {
    this.hidePanoramaView();
    this.hideYelpView();
    this.hideDisplayDirections();
};

MapEntry.prototype.onItemSelectClearEvents = function() {
    this.infoWindow.marker = null;
    this.hideContentViews();
    this.unBindButtonsFromMarker();
};

MapEntry.prototype.createYelpView = function() {
    var self = this;
    $('#yelp').css({
                display: 'flex',
                flex: 1
            });
    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var YELP_BASE_URL = 'https://api.yelp.com/v2/';
    var YELP_KEY = '_xLjE_NxysOGBW9vTF4YAA';
    var YELP_TOKEN = 'foyoWs_yChb81DQX4JivNt8b-ka_hVr9';
    var YELP_KEY_SECRET = 'rR7blQEyj5FSjmtupIgScck7D58';
    var YELP_TOKEN_SECRET = 'MkQHBL_fc2r4nIOrcLXemdffK2Y';

    var businessIDencoded = encodeURI(this.yelp);
    var yelp_url = YELP_BASE_URL + 'business/' + businessIDencoded;
    var parameters = {
        oauth_consumer_key: YELP_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb'
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            // Do stuff with results
            self.yelpData = results;
            var yelpHTML = '<div id="yelp-phone" class="yelp-item"><h4>Phone number: </h4><p id="yelp-phone">' + results.phone + '</p></div>';
            yelpHTML = yelpHTML + '<div id="yelp-url" class="yelp-item"><h4>Yelp Page: </h4><a href="' + results.url + '" target="_blank">' + results.name + '</a></div>';
            yelpHTML = yelpHTML + '<div id="yelp-img" class="yelp-item"><h4>Rating: </h4><img src="' + results.rating_img_url + '"></div>';
            $('#yelp').html(yelpHTML);
        },
        fail: function(results) {
            // Do stuff on fail
            self.yelpData = "NO YELP DATA";
        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);
    console.log(self);
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


MapEntry.prototype.displayDirections = function(self) {
    self.directionsService = new google.maps.DirectionsService();
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
