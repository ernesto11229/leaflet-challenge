
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 6
  });

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZXJuZXN0bzExMjI5IiwiYSI6ImNrYW9vbDY3czA0b2QycXFpYmh4cmU5b2wifQ.rfOuORyGpH0Vyd1XgNfpTg'
  }).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(url, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ff0000";
    case magnitude > 4:
      return "#b87606";
    case magnitude > 3:
      return "#ff8c00";
    case magnitude > 2:
      return "#ffff00";
    case magnitude > 1:
      return "#69a303";
    default:
      return "#a3ff00";
    }
  }

    function getRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 10;
  }

    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
    
 

    var legend = L.control({
      position: "bottomright"
    });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];

  

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + getColor(grades[i] +1)+ "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  

    legend.addTo(myMap);
  });