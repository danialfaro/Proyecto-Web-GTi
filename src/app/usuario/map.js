let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.81439815430156, lng: 144.96480089398648},
        zoom: 15,
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
}