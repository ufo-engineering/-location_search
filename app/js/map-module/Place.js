import Store from './Store';
import Tools from './Tools';
import Direction from './Direction';
import Marker from './Marker';

var Place = {
	getGoogleDataById(place_id, elm) {
	    $('#location_info').slideDown('fast');
	    Tools.linkClassRemover('app-nav');
	    Tools.linkClassRemover('detail-nav');
	    if (elm) elm.classList.add('active');
			var referral_available = false;
			if (elm && elm.classList.contains('referral-available'))	referral_available = true;
	    $('#' + place_id).addClass('active');
	    document.getElementById('infotab').classList.add('active');
	    var that = this;
	    var request = {
	        placeId: place_id
	    };
	    Store.service.getDetails(request, function(place, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	            that.setInfo(place, referral_available);
	            Direction.makeRoute(place);
	        }
	    });
	},
	setInfo(place, referral_available = false) {
	    if (place.address_components.length > 6) {
	        $('#place_address').html(place.address_components[0].short_name + ' ' +
	            place.address_components[1].short_name + ', ' +
	            place.address_components[2].short_name + '<br>' +
	            place.address_components[4].short_name + ' ' +
	            place.address_components[6].short_name + '<br>' +
	            place.address_components[5].short_name
	        );
	    } else {
	        $('#place_address').html(place.address_components[0].long_name + ' ' +
	            place.address_components[1].long_name + ', ' +
	            place.address_components[2].long_name
	        );
	    }
	    $('#place_name').html(place.name);

			if (referral_available) {
					$('#place_name').append('<br><button id="referral_complete_btn" data-place="'+place.place_id+'" data-name="'+place.name+'" data-location="'+place.geometry.location.lat()+' '+place.geometry.location.lng()+'">Complete Referral</button>');
					var referral_complete_btn = document.getElementById('referral_complete_btn');
					referral_complete_btn.addEventListener('click', function(e) {
						if(!$('.referral_form').length){
							e.preventDefault();
							$('#place_address').prepend($('.referral_form_example').clone().addClass('referral_form').show());
						}
					});
			}
	    $('#placeMapName').html(place.name);
	    $('#place_phone').html(place.formatted_phone_number);
	    if(place.website){
	    	$('#place_site').show();
		    $('#place_site').html(place.website);
	    }else{
	    	$('#place_site').hide()
	    }
	    $('#place_site').attr('href', place.website);
	    $('#sitetab').attr('target', '_blank');
	    $('#sitetab').attr('href', place.website);
	    $("#place_types").html(place.types.join(', '));

	    var photos = '';
	    if (place.photos) {
	        $.each(place.photos, function(i, val) {
	            var url = val.getUrl({ maxWidth: 635, maxHeight: 470 });
	            photos += '<div class="item" ><a class="img" href="' + url + '" style="background-image: url(' + url + ')"></a></div>';
	        });
	    }
	    $('#place_photos').html(photos);
	    var reviews = '';
	    if (place.reviews) {
	        $.each(place.reviews, function(i, val) {
	            reviews += '<li><div class="place_review">';
	            reviews += '<b>overall Rating:</b> ' + val.rating + '/5 <br>';
	            reviews += '<b>Author:</b> ' + val.author_name + '<br>';
	            reviews += '<p>' + val.text + '</p>';
	            reviews += '<hr/>';
	            reviews += '</div></li>';
	        });
	    }
	    $('#place_reviews').html(reviews);
	    $('#location_info').show();
	},
	clearInfo(){
		$('#place_name').html('');
		$('#placeMapName').html('');
		$('#place_phone').html('');
		$('#place_site').html('');
		$('#place_site').attr('');
		$('#sitetab').attr('');
		$('#sitetab').attr('');
		$("#place_types").html('');
		$('#location_info').hide();
	},
	showInfoBlock(){
		$('#directions_info').hide();
		$('#location_info').show();
	},
	showDirectionBlock() {
		$('#location_info').hide();
		$('#directions_info').show();
	},
	addPlacesToMap(place, method='') {
		Marker.clear();
		if(method === 'useMapForMarker'){
			Marker.create(place, 'Dropped Pin Start Point', true);
		}else{
			Marker.create(place,document.getElementById('adressInput').value);
		}
		for (var id in Store.places) {
			var place = Store.places[id];
			this.makeSideBarItm(place, method);
			Marker.create(place);
		}
	},
	makeSideBarItm(place, method='') {
		var hrfLink = place['lat'] + '&' + place['lng'];
		var nameLink = place['name'];
	    var that = this;
		var sbElemLi = document.createElement('li'),
			sbElemLink = document.createElement('a');
		sbElemLink.setAttribute('href', hrfLink);
		if (place['registered'] == true) {
			sbElemLink.setAttribute('class', 'registered-item');
		}else if (place['registered'] != true && method == 'referralMode') {
			sbElemLink.setAttribute('class', 'referral-available');
		}

		sbElemLink.addEventListener('click', (e)=>{
			e.preventDefault();
			that.getGoogleDataById(place['id'],e.target)
		})
		sbElemLink.setAttribute('id', place['id']);
		sbElemLink.innerText = nameLink;
		sbElemLi.appendChild(sbElemLink);
		document.getElementById('app-nav').appendChild(sbElemLi);
	}
}

export default Place;
