import Tools from './map-module/Tools';
import Marker from './map-module/Marker';
import Direction from './map-module/Direction';
import Store from './map-module/Store';
import Map from './map-module/Map';
import Place from './map-module/Place';
import Address from './map-module/Address';



var searchModule = {
		"method" : '',
		resultType: $('input[name=type]:checked').val(),
		getJson(lat, lng, rad) {
			Store.searchRadius = rad;
			Store.places = {};

			var radius = rad,
				that = this;

			document.getElementById('app-nav').innerHTML ="";
			var request = {
				location: {
					lat: lat,
					lng: lng
				},
				radius: radius * parseInt(document.querySelector('#distanceSI input[type="radio"]:checked').value),
				type: this.getResultType()
			};
			Store.service.nearbySearch(request, function(results, status) {
				if (status != google.maps.places.PlacesServiceStatus.OK) {
					document.getElementById('app-nav').innerHTML = 'No ' + that.getResultType() + ' listings found';
					return false;
				}

				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					if (!Store.places[place.place_id])
						Store.places[place.place_id] = { 'id': place.place_id,
												   'lat': place.geometry.location.lat(),
												   'lng': place.geometry.location.lng(),
												   'name': place.name,
												   'registered': false,
												   'popup_info': place.name
											   };
				}

				if (Store.outsideSearch) {
					if (Store.locationRadius > radius) {
						Store.places = {};
					} else {
						request.radius = Store.locationRadius * parseInt(document.querySelector('#distanceSI input[type="radio"]:checked').value);
						Store.service.nearbySearch(request, function(results, status) {
							if (status != google.maps.places.PlacesServiceStatus.OK) {
								return false;
							}
							for (var i = 0; i < results.length; i++) {
								var place = results[i];
								if (Store.places[place.place_id]) {
									delete Store.places[place.place_id];
								}
							}
							Place.addPlacesToMap(request.location, searchModule.method);
							Tools.updateWeather(request.location);
						});
					}
				} else {
					Place.addPlacesToMap(request.location, searchModule.method);
					Tools.updateWeather(request.location);
				}

			});
		},
		saveSearchPosition(lat, lng) {
			var city = document.getElementById('adressInput').value,
				distance = document.getElementById('distanceInput').value,
				location_id = document.getElementById('location_id').value,
				mapAppWrp = document.getElementById('map_b'),
				fromHotelMode = document.getElementById('fromHotelPosition');
			if(fromHotelMode && fromHotelMode.classList.contains('active')) return;
			$.ajax({
					method: "POST",
					url: "/save_search_position",
					data: { lat: lat, lng: lng, city: city, distance: distance, location_id: location_id }
				})
				.done(function(msg) {
					mapAppWrp.setAttribute('data-lat', lat);
					mapAppWrp.setAttribute('data-lng', lng);
					mapAppWrp.setAttribute('data-city', city);
					mapAppWrp.setAttribute('data-locationId', location_id);
				});
		},
		getResultType() {
			if (Store.hotelsSearch) {
				return 'lodging';
			} else {
				return this.resultType;
			}
		},
		changeHandler() {
			this.resultType = $('input[name=type]:checked').val();
		},
		disableAdressInput() {
			document.getElementById('search-form').classList.remove('active-adress');

		},
		reloadResults(){
			document.getElementById('app-nav').innerHTML = '';
			Place.clearInfo();

		},
		fromHotelPosition (){
			this.method = 'fromHotelPosition';
			this.reloadResults();
			Map.init(parseFloat(LOCATION_POINT.lat), parseFloat(LOCATION_POINT.lng),false,LOCATION_POINT.name);
		},
		useAdress: function() {
			this.method = 'useAdress';
			document.getElementById('search-form').classList.add('active-adress');
			this.reloadResults();

			if(LOCATION_POINT.lat === document.getElementById('map_b').getAttribute('data-lat') &&
				LOCATION_POINT.lng === document.getElementById('map_b').getAttribute('data-lng')){
				Map.init(parseFloat(DEFAULT_POINT.lat), parseFloat(DEFAULT_POINT.lng));
			}else{
				Map.init();
			}

		},
		referralMode: function() {
			this.method = 'referralMode';
			document.getElementById('search-form').classList.add('active-adress');
			this.reloadResults();
			PNotify.notice({
			  title: "Select and add referrals",
			  text: "Find them on map and click button 'Complete Referral'"
			});
			if(LOCATION_POINT.lat === document.getElementById('map_b').getAttribute('data-lat') &&
				LOCATION_POINT.lng === document.getElementById('map_b').getAttribute('data-lng')){
				Map.init(parseFloat(DEFAULT_POINT.lat), parseFloat(DEFAULT_POINT.lng));
			}else{
				Map.init();
			}

		},
		getCurrentPosition() {
			this.method = 'getCurrentPosition';
			this.reloadResults();
			if (!navigator.geolocation) {
				console.log("Geolocation is not supported by this browser.");
				return;
			}
			navigator.geolocation.getCurrentPosition((position)=>{
				Map.init(position.coords.latitude, position.coords.longitude);
				Address.getCityName({ lat: position.coords.latitude, lng: position.coords.longitude });
				searchModule.codeAdress(position.coords.latitude, position.coords.longitude, parseInt(distanceInput.value));
				setTimeout(Tools.updateWeather({ lat: position.coords.latitude, lng: position.coords.longitude }), 2000);
			}, (err)=>{
				console.warn(err.code + ': ' + err.message);
			});

		},
		useMapForMarker() {
			this.method = 'useMapForMarker';
			this.reloadResults();
			Map.init(Store.fromMarker.lat, Store.fromMarker.lng, true,  'Dropped Pin Start Point', Store.map.getZoom());

			// document.getElementById('startSearch').click();
					searchModule.codeAdress(Store.fromMarker.lat, Store.fromMarker.lng, parseInt(distanceInput.value));


		},
		codeAdress(latitude, longitude, rad) {
			var that = this,
				searchform = document.getElementById('search-form'),
				inputAdrs = document.getElementById('adressInput'),
				lat = latitude || Store.latlng.lat,
				lng = longitude || Store.latlng.lng,
				radiusCircle = rad || 2,
				typeGeocode;
			if (searchform.classList.contains('active-adress') && inputAdrs.value !== '') {
				typeGeocode = { 'address': inputAdrs.value }
			} else {
				typeGeocode = { 'location': { lat: Store.latlng.lat, lng: Store.latlng.lng } }
			}
			Store.geocoder.geocode(typeGeocode,
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var searchCenter = results[0].geometry.location;
						Marker.clear();
						that.getJson(searchCenter.lat(), searchCenter.lng(), radiusCircle);
						if (Store.circle) Store.circle.setMap(null);
						Store.circle = new google.maps.Circle({
							center: searchCenter,
							radius: radiusCircle * parseInt(document.querySelector('#distanceSI input[type="radio"]:checked').value),
							strokeColor: '#087F8C',
							strokeWeight: 2,
							fillOpacity: 0,
							zoom: 2,
							map: Store.map
						});
						Store.map.fitBounds(Store.circle.getBounds());
					} else {
						console.log('Geocode was not successful for the following reason: ' + status);
					}

			})
		},
		sendReferralRequest: function(ref_data){
				$.ajax({
				  method: "POST",
					crossOrigin: true,
					xhrFields: {
						 withCredentials: true
				  },
				  crossDomain: true,
				  url: "//hotelareaguide.com/create-referral",
				  data: ref_data
				})
				  .done(function( msg ) {
						if(msg.success){
							PNotify.success({
								title: "Success",
								text: msg.message
							});
						}else{
							PNotify.error({
								title: "Error",
								text: msg.message
							});
						}
						console.log(msg);
			  });
		}

	}

document.addEventListener('DOMContentLoaded', function(e) {
	if (document.getElementById('map-app')) {
		searchModule.changeHandler();
		$('.anc.active').trigger('click');
		if(LOCATION_POINT !==''){
			Map.init(parseFloat(LOCATION_POINT.lat), parseFloat(LOCATION_POINT.lng),false,LOCATION_POINT.name);
		}else{
			Map.init();
		}


		var searchForm = document.getElementById('search-form'),
			infoNavWrp = document.getElementById('detail-nav'),
			distInput = document.getElementById('distanceInput'),
			radios = document.querySelectorAll('#typeOfResult input[type=radio]');



		searchModule.codeAdress(null, null, parseInt(distanceInput.value));
		
		searchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			Tools.linkClassRemover('detail-nav');
			document.getElementById('maptab').classList.add('active');
			$('#location_info').slideUp();
			searchModule.codeAdress(null, null, parseInt(distanceInput.value));
		});
		
		infoNavWrp.addEventListener('click', function(e){
			var elm = e.target.closest('a');
			if(!document.querySelector('#app-nav a.active')){
				e.preventDefault();
				return;
			}
			if(elm && elm.id !=='sitetab'){
				e.preventDefault();
				Tools.linkClassRemover('detail-nav');
				elm.classList.add('active');
				Place[elm.getAttribute('data-action')]();
				Tools.goScroll(elm);
			}
		})


		for (var i = 0; i < radios.length; i++) {
			radios[i].addEventListener('change', function() {
				searchModule.changeHandler();
			});
		}

		document.getElementById('distance-wrp').addEventListener('click', function(e) {
			inputNumber(e, distInput);
		});


	}


$(document).ready(function() {
	$('#app-nav a').click(function() {
		$('#app-nav a').removeClass('active');
		$(this).addClass('active');
	});


	$('#sfw-btn').click(function() {
		$('#full-screen-wrp').toggleClass('shw');
	});
	$('.anc').click(function() {
		var method = $(this).attr('id');
		$('.anc').removeClass('active');
		$(this).addClass('active');
		if (method !== 'useAdress' || method !== 'referralMode') searchModule.disableAdressInput();
		searchModule[method]();



		return false;

	});

	$(document).on('click', '.referral_form .submit_btn', function(){
			var ref_data = {
					'place_id': $('#referral_complete_btn').data('place'),
					'name': $('.referral_form .name_inp').val(),
					'phone': $('.referral_form .phone_inp').val(),
					'ref_email': $('.referral_form .email_ref_inp').val(),
					'place_name': $('#referral_complete_btn').data('name'),
					'location': $('#referral_complete_btn').data('location'),
			};
			if(ref_data.name == '' || ref_data.phone == '' || ref_data.ref_email == ''){
				PNotify.error({
					title: "Error",
					text: "Fill all referral fields"
				});
				return false;
			}
			searchModule.sendReferralRequest(ref_data);
	})
})




})

function inputNumber(e, elm) {
	if (e.target.nodeName !== 'SPAN') return;
	if (e.target.id === 'dec' && elm.value > 0) {
		elm.value = parseInt(elm.value) - 1;
	} else if (e.target.id === 'inc') {
		elm.value = parseInt(elm.value) + 1
	}
}



