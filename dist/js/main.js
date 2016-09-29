function ViewModel(){vm=this,vm.entryList=ko.observableArray(entryList),vm.categoriesFilter=ko.observable(categoriesFilter),vm.categories=ko.computed(function(){var a=ko.utils.arrayMap(vm.entryList(),function(a){return a.category});return a.sort()},vm),vm.uniqueCategories=ko.computed(function(){var a=["None"];return a.concat(ko.utils.arrayGetDistinctValues(vm.categories()).sort())},vm),vm.filterMarkers=function(){mapEntryList.forEach(function(a){console.log(vm.categoriesFilter()),console.log(a.category),a.category==vm.categoriesFilter()||"None"==vm.categoriesFilter()?a.showMarker():a.hideMarker()})},vm.entryListFiltered=ko.computed(function(){var a=vm.categoriesFilter();return a&&"None"!=a?ko.utils.arrayFilter(vm.entryList(),function(b){return b.category==a}):vm.entryList()}),vm.entryListFiltered.subscribe(function(){vm.filterMarkers()})}var themeColors=["#e384a6","#f4d499","#4d90d6","#c7e38c","#9986c8","#edf28c","#ffd1d4","#5ee1dc","#b0eead","#fef85a","#8badd2"],categoryColors={school:"#e384a6",food:"#f4d499",leasure:"#4d90d6",party:"#c7e38c"},categoryColorsIcon={school:"e384a6",food:"f4d499",leasure:"4d90d6",party:"c7e38c"},vm,mapEntryList=[],entryList=[],categoriesFilter="None";mapEntries.forEach(function(a){entryList.push(new ListEntry(a)),mapEntryList.push(new MapEntry(a))}),initMap=function(){var a=new google.maps.Map(document.getElementById("map"),{center:{lat:55.6761,lng:12.5683},zoom:14,styles:styles}),b=new google.maps.places.PlacesService(a),c=new google.maps.StreetViewService,d=new google.maps.DirectionsService,e=new google.maps.InfoWindow({}),f=new google.maps.LatLngBounds;mapEntryList.forEach(function(g){g.initMarker(b,c,d,a,e,f)})},ko.applyBindings(new ViewModel);