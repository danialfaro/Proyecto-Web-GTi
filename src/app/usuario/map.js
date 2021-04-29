let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.80030995551754, lng: 144.97832655465268},
        zoom: 12,
        mapTypeId: 'hybrid',
        styles: [
            {
                featureType: 'poi',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'transit',
                stylers: [{visibility: 'off'}]
            }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        zoomControl:false,
    });
	var marker1 = new google.maps.Marker({
            position: {lat: -37.78535123595972, lng: 144.95436592384175},
            label: "1",
            animation: google.maps.Animation.DROP,
            map: map
    });
	var marker2 = new google.maps.Marker({
            position: {lat: -37.82092593042849, lng: 144.97874251347298},
            label: "2",
            animation: google.maps.Animation.DROP,
            map: map
    });
	var marker3 = new google.maps.Marker({
            position: {lat: -37.79155275567427, lng: 145.00957500199306},
            label: "3",
            animation: google.maps.Animation.DROP,
            map: map
    });

}