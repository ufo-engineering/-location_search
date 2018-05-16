import Store from './Store';
var Address = {
	get(latlang, callback){
	    Store.geocoder.geocode({
	        'latLng': latlang
	        }, function(res){
	            if(! res[0].formatted_address) return;
	            if(latlang.lat === parseFloat(DEFAULT_POINT.lat) &&
	            latlang.lng === parseFloat(DEFAULT_POINT.lng)){
	                callback(DEFAULT_POINT.address);
	                document.getElementById('adressInput').value  = DEFAULT_POINT.address;
	            }else{
	                callback(res[0].formatted_address);
	                document.getElementById('adressInput').value = res[0].formatted_address;
	            }                
	    });            
	},
	getCityName(coordinates){
	    var lat = coordinates['lat'];
	    var long = coordinates['lng'];
	    $.ajax({
	        type: 'GET',
	        dataType: "json",
	        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=false",
	        data: {},
	        error: function() { console.log('error'); }
	    });
	}
}

export default Address;
