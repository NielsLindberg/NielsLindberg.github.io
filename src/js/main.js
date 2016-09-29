var themeColors = ['#e384a6', '#f4d499', '#4d90d6', '#c7e38c', '#9986c8', '#edf28c', '#ffd1d4', '#5ee1dc', '#b0eead', '#fef85a', '#8badd2'];
var categoryColors = {
    school: '#e384a6',
    food: '#f4d499',
    leasure: '#4d90d6',
    party: '#c7e38c',
};
var categoryColorsIcon = {
    school: 'e384a6',
    food: 'f4d499',
    leasure: '4d90d6',
    party: 'c7e38c',
};

var vm;
var mapEntryList = [];
var entryList = [];
var categoriesFilter = 'None';

mapEntries.forEach(function(entryData) {
    entryList.push(new ListEntry(entryData));
    mapEntryList.push(new MapEntry(entryData));
});

initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 55.6761,
            lng: 12.5683
        },
        zoom: 14,
        styles: styles
    });
    /* load the needed map services */
    var placeService = new google.maps.places.PlacesService(map);
    var streetService = new google.maps.StreetViewService();
    var directionsService = new google.maps.DirectionsService();

    var infoWindow = new google.maps.InfoWindow({});
    var bounds = new google.maps.LatLngBounds();

    mapEntryList.forEach(function(mapEntry) {
        mapEntry.initMarker(placeService, streetService, directionsService, map, infoWindow, bounds);
    });
};

function ViewModel() {
    vm = this;
    vm.entryList = ko.observableArray(entryList);
    vm.categoriesFilter = ko.observable(categoriesFilter);

    vm.categories = ko.computed(function() {
        var categories = ko.utils.arrayMap(vm.entryList(), function(listEntry) {
            return listEntry.category;
        });
        return categories.sort();
    }, vm);

    vm.uniqueCategories = ko.computed(function() {
        var uniqueCategories = ['None'];
        return uniqueCategories.concat(ko.utils.arrayGetDistinctValues(vm.categories()).sort());
    }, vm);

    vm.filterMarkers = function() {
        mapEntryList.forEach(function(mapEntry) {
            if (mapEntry.category == vm.categoriesFilter() || vm.categoriesFilter() == 'None') {
                mapEntry.showMarker();
            } else {
                mapEntry.hideMarker();
            }
        });
    };

    vm.entryListFiltered = ko.computed(function() {
        var filter = vm.categoriesFilter();
        if (!filter || filter == "None") {
            return vm.entryList();
        } else {
            return ko.utils.arrayFilter(vm.entryList(), function(listEntry) {
                return listEntry.category == filter;
            }, vm.filterMarkers());
        }
    });
}

ko.applyBindings(new ViewModel());
