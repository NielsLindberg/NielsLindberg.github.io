var mapEntries = [{
    name: "Islands Brygge",
    description: "City harbor bath",
    tags: ['leasure', 'bathing', 'beachvolley', 'sports']
}, {
    name: "Kebabistan",
    description: "Best Vesterbro Shawarma",
    tags: ['food', 'turkish', 'fastfood']
}];


var MapEntry = function(data) {
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
};

function MapEntryViewModel() {
    var self = this;
    this.mapEntryList = ko.observableArray([]);
    mapEntries.forEach(function(mapEntry) {
        self.mapEntryList.push(new MapEntry(mapEntry));
    });
}

ko.applyBindings(new MapEntryViewModel());