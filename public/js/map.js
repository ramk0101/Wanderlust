const coordinatesArray = Array.isArray(coordinates) 
    ? coordinates 
    : JSON.parse(coordinates);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
   
    center: [77.2088, 28.6139], // [lng, lat] → New Delhi
    zoom: 9 // starting zoom
});
console.log("Coordinates:", coordinates);
console.log("Type of coordinates:", typeof coordinates);
console.log("Is array?", Array.isArray(coordinates));


// console.log(coordinatesArray);
// const marker1 = new mapboxgl.Marker()
//         .setLngLat(coordinatesArray)
//         .addTo(map);