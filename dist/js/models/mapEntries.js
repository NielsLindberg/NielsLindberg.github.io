var mapEntries=[{search:"CBS, Solbjerg Campus",title:"CBS, Solbjerg Campus",category:"School"},{search:"Harbor Bath, Islands Brygge",title:"Harbor Bath, Islands Brygge",category:"Bathing",yelp:"havnebadet-islands-brygge-københavn-s"},{search:"Harbor Bath, Kalvebod Brygge",title:"Harbor Bath, Kalvebod Brygge",category:"Bathing",yelp:"kalvebod-bølge-københavn"},{search:"Kebabistan, Istedgade",title:"Kebabistan",category:"Fastfood",yelp:"kebabistan-københavn"},{search:"Ricco's, Fælledvej",title:"Ricco's, Fælledvej",category:"Café"},{search:"KB18, Kødbyen",title:"KB18",category:"Club",yelp:"kb18-københavn-v"},{search:"Culture Box, Kronprinsessegade",title:"Culture Box",category:"Club",yelp:"culture-box-københavn-2"},{search:"Boulevarden, Sønder Boulevard",title:"Boulevarden",category:"Bodega"},{search:"Scarpetta, Rantzausgade",title:"Scarpetta",category:"Restaurant",yelp:"scarpetta-københavn-n"},{search:"Five Star, Nørrebrogade",title:"Five Star Shawarma",category:"Fastfood",yelp:"five-star-shawarma-københavn"},{search:"Bolsjefabrikken, Ragnhildgade",title:"Bolsjefabrikken",category:"Club",yelp:"bolsjefabrikken-københavn-ø"},{search:"Howitzvej 60",title:"CBS, IT Campus",category:"School"},{search:"Pasta Mania, Elmegade",title:"Pasta Mania",category:"Fastfood",yelp:"pasta-mania-københavn-n"},{search:"Liban Cuisine, Rantzausgade",title:"Liban Cuisine",category:"Fastfood",yelp:"liban-cuisine-københavn"},{search:"Diligencen, Korsgade",title:"Diligencen",category:"Bodega",yelp:"diligencen-københavn-n"},{search:"Amager Strandpark",title:"Amager Beachpark",category:"Bathing",yelp:"amager-strandpark-københavn-s"}],errorMessages={googleMap:"There was some issues retrieving google maps",googleStreetService:"There was some issues in retrieving streetview for this location",googleDirections:"There was some issues in retrieving directions for this location",yelp:"There was some issues in retrieving yelp data for this location"},loadingMessages={googleMap:"Retrieving google maps...",googleStreetService:"Retrieving google streetview...",googleDirections:"Retrieving google directions...",yelp:"Retrieving yelp data..."},yelpStatic={phone:"Phone number: ",rating:"Rating: ",url:"Yelp Page: ",logoUrl:"images/yelp-2c.png",YELP_BASE_URL:"https://api.yelp.com/v2/",YELP_KEY:"_xLjE_NxysOGBW9vTF4YAA",YELP_TOKEN:"foyoWs_yChb81DQX4JivNt8b-ka_hVr9",YELP_KEY_SECRET:"rR7blQEyj5FSjmtupIgScck7D58",YELP_TOKEN_SECRET:"MkQHBL_fc2r4nIOrcLXemdffK2Y"},directionsDisplayList=[],Entry=function(a,b){this.title=a.title,this.search=a.search,this.id=b,this.category=a.category,this.yelp=a.yelp},ListEntry=function(a,b){Entry.call(this,a,b),this.contentButtonsVisible=ko.observable(!1)};ListEntry.prototype=Object.create(Entry.prototype),ListEntry.prototype.constructor=ListEntry;var MapEntry=function(a,b){Entry.call(this,a,b),this.radius=100,this.placeService=null,this.streetService=null,this.directionsService=null,this.map=null,this.foundPlace=null,this.infoWindow=null,this.panorama=null,this.directions=null,this.bounds=null};MapEntry.prototype=Object.create(Entry.prototype),MapEntry.prototype.constructor=MapEntry,MapEntry.prototype.initMarker=function(a,b,c,d,e,f){function g(b,c){c==google.maps.places.PlacesServiceStatus.OK?(h.addQueryResultToObject(b[0]),h.addMarker(),h.addMarkerListeners(),h.showMarker(),h.map.fitBounds(h.bounds),h.foundPlace=!0):i<120?(setTimeout(function(){i++,a.textSearch(j,g)},100),h.foundPlace=!1):h.foundPlace=!1}var h=this;this.placeService=a,this.streetService=b,this.directionsService=c,this.map=d,this.infoWindow=e,this.bounds=f;var i=1,j={query:h.search};a.textSearch(j,g)},MapEntry.prototype.addQueryResultToObject=function(a){var b=this;this.placeData=a,this.location=a.geometry.location,this.formattedName=a.formatted_address,this.icon={url:"http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+b.id+"|"+vm.categoryIconColors[b.category]+"|000000",size:new google.maps.Size(20,32),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(10,32)}},MapEntry.prototype.addMarkerListeners=function(){var a=this;a.marker.addListener("click",function(){a.onItemSelectClearEvents(),a.populateInfoWindow(),a.toggleBounce(),vm.selectedItemTitle(a.title)})},MapEntry.prototype.addMarker=function(){var a=this;this.marker=new google.maps.Marker({title:a.title,animation:google.maps.Animation.DROP,id:a.id,icon:a.icon,position:a.location})},MapEntry.prototype.showMarker=function(){this.marker.setMap(this.map),this.bounds.extend(this.marker.position)},MapEntry.prototype.hideMarker=function(){this.marker.setMap(null)},MapEntry.prototype.populateInfoWindow=function(){if(this.infoWindow.marker!=this.marker){var a=this;this.infoWindow.setContent('<div id="infowindow">'+a.title+"</div>"),this.infoWindow.marker=this.marker,this.infoWindow.open(this.map,this.marker),this.infoWindow.addListener("closeclick",function(){a.onItemSelectClearEvents(),vm.selectedItemTitle("Select a location")}),this.showContentButtons(a)}},MapEntry.prototype.showContentButtons=function(a){vm.entryList().forEach(function(b){b.id==a.id&&b.contentButtonsVisible(!0)})},MapEntry.prototype.hideContentButtons=function(){vm.entryList().forEach(function(a){a.contentButtonsVisible(!1)})},MapEntry.prototype.hidePanoramaView=function(){vm.panoVisible(!1)},MapEntry.prototype.hideYelpView=function(){vm.yelpVisible(!1)},MapEntry.prototype.hideDisplayDirections=function(){directionsDisplayList.length>0&&directionsDisplayList.forEach(function(a){a.setMap(null),a.setDirections({routes:[]})}),vm.directionsVisible(!1)},MapEntry.prototype.hideContentViews=function(){this.hidePanoramaView(),this.hideYelpView(),this.hideDisplayDirections()},MapEntry.prototype.onItemSelectClearEvents=function(){this.infoWindow.marker=null,this.hideContentViews(),this.hideContentButtons()},MapEntry.prototype.toggleBounce=function(){var a=this;this.marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){a.marker.setAnimation(null)},1400)},MapEntry.prototype.createYelpView=function(){function a(){return Math.floor(1e12*Math.random()).toString()}vm.yelpVisible(!0),vm.yelpLoading(!0),vm.yelpError(!1),vm.yelpContentVisible(!1);var b=encodeURI(this.yelp),c=yelpStatic.YELP_BASE_URL+"business/"+b,d={oauth_consumer_key:yelpStatic.YELP_KEY,oauth_token:yelpStatic.YELP_TOKEN,oauth_nonce:a(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",oauth_version:"1.0",callback:"cb"},e=oauthSignature.generate("GET",c,d,yelpStatic.YELP_KEY_SECRET,yelpStatic.YELP_TOKEN_SECRET);d.oauth_signature=e;var f={url:c,data:d,cache:!0,dataType:"jsonp",success:function(a){vm.yelpPhone(a.phone?a.phone:"No phone number"),vm.yelpRatingImgUrl(a.rating_img_url?a.rating_img_url:"#"),vm.yelpUrl(a.url?a.url:"#"),vm.yelpName(a.name?a.name:"No name found"),vm.yelpContentVisible(!0)},error:function(a){vm.yelpError(!0)},complete:function(){vm.yelpLoading(!1)}};$.ajax(f)},MapEntry.prototype.createPanoramaView=function(a){function b(b,c){if(c==google.maps.StreetViewStatus.OK){var d=b.location.latLng,e=google.maps.geometry.spherical.computeHeading(d,a.marker.position),f={position:d,linksControl:!1,panControl:!1,enableCloseButton:!1,pov:{heading:e,pitch:0}};a.panorama=new google.maps.StreetViewPanorama(document.getElementById("pano"),f),vm.panoContentVisible(!0)}else vm.panoError(!0);vm.panoLoading(!1)}a.streetService=new google.maps.StreetViewService,vm.panoVisible(!0),vm.panoLoading(!0),vm.panoError(!1),vm.panoContentVisible(!1),a.streetService.getPanoramaByLocation(a.marker.position,a.radius,b)},MapEntry.prototype.displayDirections=function(a){a.directionsService=new google.maps.DirectionsService,vm.directionsVisible(!0),vm.directionsLoading(!0),vm.directionsError(!1);var b=vm.mapEntryList[0].location,c=a.location,d="TRANSIT";a.directionsService.route({origin:b,destination:c,travelMode:google.maps.TravelMode[d]},function(b,c){if(c===google.maps.DirectionsStatus.OK){var d=new google.maps.DirectionsRenderer({map:a.map,directions:b,draggable:!1,polylineOptions:{strokeColor:"#282828"},markerOptions:{visible:!1},preserveViewport:!0});d.setPanel(document.getElementById("directions")),directionsDisplayList.push(d),a.directions=d}else vm.directionsError(!0);vm.directionsLoading(!1)})};