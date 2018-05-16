import Store from './Store';
import Tools from './Tools';
import Map from './Map';
import Place from './Place';


var Marker = {
    lastPinLocation: null,
	create(place, infoWindowText = '', draggable = false) {
	    var that = this,
	        icon = null,
	        startPosition;
	    if (place['registered']) {
	        icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
	    }
	    if(draggable){
	        icon = '../img/draged.svg';
	    }
	    if (draggable && Tools.validator.isEmpty(!that.lastPinLocation)) {
	        startPosition = that.lastPinLocation
	    } else {
	        startPosition = { lat: place['lat'], lng: place['lng'] }
	    }

	    var marker = new google.maps.Marker({
	        position: startPosition,
	        map:Store.map,
	        icon: icon,
	        draggable: draggable
	    });
	    if (place['popup_info']) {
	        that.addInfoWindowForMarker(marker, place);
	    }

	    if (place['id']) {
	        marker.addListener('click', function() {
	            Place.getGoogleDataById(place['id']);
	        });

	    }
	    if (infoWindowText != '') {
	        var infowindow = new google.maps.InfoWindow({
	            content: infoWindowText
	        });
	        infowindow.open(Store.map, marker);
	    }
	    if (draggable) {
	        marker.addListener('dragend', function(handleEvent) {
	            that.lastPinLocation = { lat: handleEvent.latLng.lat(), lng: handleEvent.latLng.lng() }
	            Map.init(handleEvent.latLng.lat(), handleEvent.latLng.lng(), true, null, Store.map.getZoom());
	        });
	    }
	    marker.setAnimation(google.maps.Animation.DROP);
	    Store.gmarkers.push(marker);
	},
	addInfoWindowForMarker(marker, place) {
	    var infowindow = new google.maps.InfoWindow();
	    infowindow.setContent('<div><strong>' + place['name'] + '</strong><br>');
	    marker.addListener('mouseover', function() {
	        infowindow.open(Store.map, this);
	    });
	    marker.addListener('mouseout', function() {
	        infowindow.close();
	    });
	},
	setMapOnAll(map) {
	    for (var i = 0; i < Store.gmarkers.length; i++) {
	        Store.gmarkers[i].setMap(map);
	    }
	},
	clear() {
	    this.setMapOnAll(null);
	    Store.gmarkers.length = 0;
	}
};

export default Marker;
