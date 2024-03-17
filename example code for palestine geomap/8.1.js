var w = 1000;
var h = 1000;
var padding = 50;

var color = d3.scaleOrdinal(d3.schemeCategory10);

// Define projection settings
var projection = d3.geoMercator()
                   .center([35.2, 31.9]) // Adjusted center for Palestine
                   .scale(25000) // Adjusted scale for better fit
                   .translate([w / 2, h / 2]);

var path = d3.geoPath()
             .projection(projection);

// Start the SVG block
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "img");

d3.json("palestine-with-regions_1504.geojson").then(function(json) {

    // Draw GeoJSON features
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("stroke", "dimgray")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", path);
});
