var w = 1000;
var h = 1000;
var padding = 50;

var color = d3.scaleOrdinal()
    .range(["#FFFF00", "#FFA500", "#F08080", "#FF0000"]);

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

d3.json("palestine-with-regions_1504.geojson").then(function (json) {

    // Draw GeoJSON features
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("stroke", "dimgray")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", path);
});


d3.csv("event_data_pse.csv", function(d) {
    // Convert latitude and longitude to numbers
    const lat = +d.latitude;
    const long = +d.longitude;

    // Check if latitude and longitude are valid numbers
    if (!isNaN(lat) && !isNaN(long)) {
        return {
            lat: lat,
            long: long,
            event_name: d.event_name
        };
    }
}).then(function(data) {
    // Filter out any invalid or missing data points
    const validData = data.filter(d => d !== undefined);

    svg.selectAll("circle")
        .data(validData)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return projection([d.long, d.lat])[0];
        })
        .attr("cy", function(d, i) {
            return projection([d.long, d.lat])[1];
        })
        .attr("r", 5)
        .style("fill", function(d) {
            return d.event_name.includes("Palestine: Unknown (IAC) (Hostilities Gaza/Israel) - Gaza Strip") ? "green" : "blue";
        });
})



