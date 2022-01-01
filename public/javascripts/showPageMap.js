mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [-74.5,40], // starting position [lng, lat]
    zoom: 3 // starting zoom
});   

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat([-74.5,40])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<p>${campground.location}</p>`
            )
    )
    .addTo(map)