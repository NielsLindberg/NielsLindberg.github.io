var themeColors = ['#ffffff', '#e384a6', '#f4d499', '#4d90d6', '#c7e38c', '#9986c8', '#edf28c', '#ffd1d4', '#5ee1dc', '#b0eead', '#fef85a', '#8badd2'];
var vm;


function ViewModel() {
    vm = this;
    vm.mapEntryList = [];
    vm.entryList = ko.observableArray([]);

    mapEntries.forEach(function(entryData, index) {
        var id = String.fromCharCode(65 + index);
        vm.entryList.push(new ListEntry(entryData, id));
        vm.mapEntryList.push(new MapEntry(entryData, id));
    });


    vm.entryListFiltered = ko.observableArray(vm.entryList());
    vm.initMap = function() {
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

        vm.mapEntryList.forEach(function(mapEntry) {
            mapEntry.initMarker(placeService, streetService, directionsService, map, infoWindow, bounds);
        });
    };
    /* Category filter stuff */
    vm.categoriesFilter = ko.observable('All');
    vm.itemFilter = ko.observable('All');

    vm.categoryLabelFilter = function(data, event) {
        /* forceing notefications by setting to null first */
        vm.categoriesFilter('');
        vm.categoriesFilter(data.category);
    };

    vm.itemLabelFilter = function(data, event) {
        vm.mapEntryList.forEach(function(mapEntry) {
            if (mapEntry.id == data.id) {
                mapEntry.infoWindow.marker = null;
                mapEntry.unBindButtonsFromMarker();
                mapEntry.hideContentViews();
                mapEntry.populateInfoWindow();
            }
        });
    };

    vm.categories = ko.computed(function() {
        var categories = ko.utils.arrayMap(vm.entryList(), function(listEntry) {
            return listEntry.category;
        });
        return categories.sort();
    }, vm);

    vm.uniqueCategories = ko.computed(function() {
        var uniqueCategories = ['All'];
        return uniqueCategories.concat(ko.utils.arrayGetDistinctValues(vm.categories()).sort());
    }, vm);

    vm.categoryColors = {};
    vm.categoryIconColors = {};
    vm.uniqueCategories().forEach(function(category, index) {
        var color;
        var colorIcon;
        if (index < themeColors.length - 1) {
            color = themeColors[index];
            colorIcon = themeColors[index].substring(1, 7);
        } else {
            color = themeColors[themeColors.length - 1];
            colorIcon = themeColors[themeColors.length - 1].substring(1, 7);
        }
        vm.categoryColors[category] = color;
        vm.categoryIconColors[category] = colorIcon;
    });

    vm.filterMarkers = function() {
        vm.mapEntryList.forEach(function(mapEntry) {
            mapEntry.closeInfoWindowEvents();
            if (mapEntry.category == vm.categoriesFilter() || vm.categoriesFilter() == 'All') {
                mapEntry.showMarker();
            } else {
                mapEntry.hideMarker();
            }
        });
    };

    vm.categoriesFilter.subscribe(function() {
        var filter = vm.categoriesFilter();
        if (!filter || filter == 'All') {
            vm.entryListFiltered(vm.entryList());
        } else {
            vm.entryListFiltered(ko.utils.arrayFilter(vm.entryList(), function(listEntry) {
                return listEntry.category == filter;
            }));
        }
    });

    vm.entryListFiltered.subscribe(function() {
        vm.filterMarkers();
    });
}

ko.applyBindings(new ViewModel());
