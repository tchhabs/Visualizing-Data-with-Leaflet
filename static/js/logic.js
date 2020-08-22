// Create our map
var myMap = L.map("map", {
  center: [36.7783, -119.4179],
  zoom: 5
});
// Define satellite map layer
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

  // Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

var overlayMaps = {
    Earthquakes: earthquakes
  };

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//Query URL to the GeoJSON of the weekly earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});

function createFeatures(earthquakeData) { 
// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing details of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p><b>Magnitude:</b> " + feature.properties.mag + "</p>");
}

//Function that assigns a color according to the magnitude of an earthquake
function getcolor(magnitude){
    switch (true) {
        case magnitude>5:
            return "#fc035e";
        case magnitude>=4:
            return "#fc7b03";
        case magnitude>=3:
            return "#fcba03";
        case magnitude>=2:
            return "#8c03fc";
        case magnitude>=1:
            return "#03fc88";
        case magnitude>=0:
            return "#03adfc"   
        default:
            return "white";
    }
}

//Function that gets the radius according to the magnitude to plot relative strength of the earthquake
function getradius(magnitude){
    return magnitude*5;
}

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
L.geoJSON(earthquakeData, {
             
  onEachFeature: onEachFeature,
  //Change the default marker to a circle marker that calls the getcolor and getradius functions according to each earthquake's magnitude
  pointToLayer: function (feature, coordinates) {
            var magnitude = feature.properties.mag;
            return new L.circleMarker(coordinates, {
        color: "White",
        fillColor: getcolor(magnitude),
        radius: getradius(magnitude),
        fillOpacity: 1,
        weight: 0.5
    });
  }
//Adds the earthquake layer to the map
}).addTo(myMap);

// Set up the legend
var legend = L.control({position: 'topright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 1, 2, 3, 4, 5];
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
}

