import Store from './Store';
import Address from './Address';
import Marker from './Marker';


var Map = {
	init(lattitude = 0, longitude = 0, draggable = false, customtext) {
	    var slug = $('#map_b').data('slug');
	    var displayhotels = $('#map_b').data('displayhotels');
	    var mapWrapper = document.getElementById('map_b');

	    Store.locationRadius = $('#map_b').data('locationradius');
	    if (slug == 'hotels') {
	        Store.hotelsSearch = true;
	        if (displayhotels == 2) {
	            Store.outsideSearch = true;
	        }
	    }
	    if (lattitude == 0 && longitude == 0) {
	        Store.latlng = {
	            lat: parseFloat(mapWrapper.getAttribute('data-lat')),
	            lng: parseFloat(mapWrapper.getAttribute('data-lng'))
	        };
	    } else {
	        Store.latlng = {
	            lat: lattitude,
	            lng: longitude
	        };
	    }
	    Store.fromMarker = Store.latlng;
	    Store.map = new google.maps.Map(mapWrapper, {
	        zoom: 12,
	        center: Store.latlng,
	        disableDefaultUI: true,
	        fullscreenControl: false,
	        gestureHandling: 'greedy'
	    });

	    Store.service = new google.maps.places.PlacesService(Store.map);
	    Store.directionsService = new google.maps.DirectionsService;
	    Store.directionsDisplay = new google.maps.DirectionsRenderer({
	        suppressMarkers: true
	    });
	    
	    Store.directionsDisplay.setMap(Store.map);
	    var bottomControl = document.createElement('div');
	    bottomControl.classList.add('map-control');

	    var centerControl = new MakeControl(bottomControl, Store.map, true);
	    bottomControl.index = 1;
	    Store.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(bottomControl);
	    if(Store.fromMarker.lat===parseFloat(mapWrapper.getAttribute('data-lat')) &&
	        Store.fromMarker.lng===parseFloat(mapWrapper.getAttribute('data-lng'))){
	        Address.get(Store.latlng, function(adress){
	            Marker.create(Store.fromMarker, customtext || adress, draggable);
	        })
	    }else{
	        document.getElementById('app-nav').innerHTML='';
	        Address.get(Store.fromMarker,function(adress){
	            Marker.create(Store.fromMarker, adress, draggable);
	        })

	    }

	}
}

export default Map;
