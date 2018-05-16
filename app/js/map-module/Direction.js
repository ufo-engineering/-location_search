import Marker from './Marker';
import Store from './Store';

var Direction = {
	makeRoute(place) {
		Marker.clear();

		var that = this,
			fromMarker = {},
			mode = 'DRIVING',
			fromHotelBtn = document.getElementById('fromHotelPosition');

		if (Store.searchRadius <= 2) {
			mode = 'WALKING';
		}
		if(fromHotelBtn && fromHotelBtn.classList.contains('active')){

			fromMarker = {
				lat: parseFloat(document.getElementById('map_b').getAttribute('data-lat')),
				lng: parseFloat(document.getElementById('map_b').getAttribute('data-lng'))
			};


		}else{
			fromMarker = {
				lat: parseFloat(Store.latlng.lat),
				lng: parseFloat(Store.latlng.lng),
			};
		}
		Store.directionsService.route({
			origin: fromMarker,
			destination: place.geometry.location,
			travelMode: mode
		}, function(response, status) {
			if (status === 'OK') {
				Store.directionsDisplay.setDirections(response);	
				if(LOCATION_POINT.lat && parseFloat(LOCATION_POINT.lat) === fromMarker.lat  && fromMarker.lng === parseFloat(LOCATION_POINT.lng)){
					Marker.create(fromMarker, 'LOCATION_POINT.name');
				}else{
					Marker.create(fromMarker, 'Start Location');
				}
				Marker.create({ 'lat': place.geometry.location.lat(), 'lng': place.geometry.location.lng() }, place.name);
				that.flushDirections();
				that.getAllDirections(fromMarker, place.geometry.location);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	},
	getAllDirections(origin, destination) {
		var modes = ['WALKING', 'DRIVING', 'BICYCLING', 'TRANSIT'];
		var that = this;
		$.each(modes, function(index, value) {
			Store.directionsService.route({
				origin: origin,
				destination: destination,
				travelMode: value
			}, function(response, status) {
				if (status === 'OK') {
					Store.directionsDisplay.setDirections(response);
					that.showDirections(response, value);
				} else {
					console.log('Directions request failed due to ' + status);
				}
			});
		});
	},
	flushDirections() {
		$('#directions_driving').html('');
		$('#directions_transit').html('');
		$('#directions_bicycling').html('');
		$('#directions_walking').html('');
	},
	showDirections(directionResult, mode = 'WALKING') {
		var myRoute = directionResult.routes[0].legs[0];
		for (var i = 0; i < myRoute.steps.length; i++) {
			$('#directions_' + mode.toLowerCase()).append('<p>' + myRoute.steps[i].instructions + ' ' + myRoute.steps[i].distance.text + '</p>');
		}
	}
}

export default Direction;