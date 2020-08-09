var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


var EQ_Map = L.map("map", {
    center: [37.7749, -122.4194],zoom: 4
  });
  
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiYmlnYmx1ZXkiLCJhIjoiY2p1dTVzeHZ3MDBxZTN5cHMwcGdwcTFmdyJ9.FMNXMqklO747udRE11dCwg"
  }).addTo(EQ_Map);

//  GET RADIUS
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  
  // GET COLOR
  function chooseColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return "#f06b6b";
        case magnitude > 4:
            return "#f0a76b";
        case magnitude > 3:
            return "#e1ba4d";
        case magnitude > 2:
            return "#e1db4d";
        case magnitude > 1:
            return "#e1f34d";
        default:
            return "#b8f24d";
    }
}

  // CIRCLE MAKER    
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      
   // POPUP
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(EQ_Map);
      
  // MAGNITUDE
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  
  // LEGEND
    var legend = L.control({ position: "bottomright" });
       legend.onAdd = function() {
           var div = L.DomUtil.create("div", "info legend"), 
           magnitudeLevels = [0, 1, 2, 3, 4, 5];
   
           for (var i = 0; i < magnitudeLevels.length; i++) {
               div.innerHTML +=
                   '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                   magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
           }
           return div;
       };
    // LEGEND TO MAP
       legend.addTo(EQ_Map);
   });
   
