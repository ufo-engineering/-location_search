var Tools = {
	validator: {
	    isEmpty(value) {
	        return (!value || isNaN(value) || value == '' || value == 0);
	    },
	    isUndef(value){
	        return (value === undefined)
	    }
	},
	linkClassRemover(idWrp) {
	    var navACol = document.getElementById(idWrp).querySelectorAll('a');
	    for (var i = 0; i < navACol.length; i++) {
	        navACol[i].classList.remove('active');
	    }
	},
	updateWeather(place) {
		$('.weather').html('<iframe sandbox="allow-scripts allow-same-origin" id="forecast_embed" type="text/html" frameborder="0" src="//forecast.io/embed/#lat=' + place['lat'] + '&lon=' + place['lng'] + '&name=Weather for ' + document.getElementById('map_b').getAttribute('data-city') + '"> </iframe>');
	},
	goScroll(elm){
	    var anchor = elm;
	    $('html, body').stop().animate({
	        scrollTop: $(anchor.getAttribute('href')).offset().top
	    }, 1500);
	}	
}

export default Tools;
