var w = 1000;
var h = 1000;

// Define projection settings
var projection = d3.geoMercator()
    .center([0, 25]) // Centering the map
    .scale(720) // Adjusting scale to make the map four times bigger
    .translate([w / 2.5, h]);

var path = d3.geoPath()
    .projection(projection);

// Start the SVG block
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "img");

// Load and render GeoJSON data
d3.json("europe_.geojson").then(function (json) {
    // Draw GeoJSON features
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("stroke", "dimgray")
        .attr("fill", "#FFFF00") // Setting a fixed fill color
        .attr("d", path);
}).catch(function(error) {
    // Handle errors
    console.log("Error loading GeoJSON:", error);
});
