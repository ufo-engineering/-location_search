var Store = {
    "map" : null,
	"circle" : null,
	"gmarkers" : [],
	"latlng" : {},
	"geocoder" : new google.maps.Geocoder(),
	"service" : null,
	"places" : {},
	"fromMarker" : null,
	"directionsService" : null,
	"directionsDisplay" : null,
	"searchRadius" : 0,
	"slickInitialized" : false,
    "hotelsSearch" : false,
    "outsideSearch" : false,
    "locationRadius" : 0
}

export default Store;
