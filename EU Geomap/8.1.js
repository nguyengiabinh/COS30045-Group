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
    // Load CSV data
    d3.csv("Book1.csv").then(function(data) {
        // Create a dictionary to map country names to data values
        var dataMap = {};
        data.forEach(function(d) {
            dataMap[d.countryname.trim()] = +d.number; // Trimming whitespace from country name
        });

        // Draw GeoJSON features
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("stroke", "dimgray")
            .attr("d", path)
            .style("fill", function(d) {
                var countryName = d.properties.NAME;
                var value = dataMap[countryName];
                if (value >= 0 && value <= 100000) {
                    return "blue";
                } else if (value >= 100001 && value <= 500000) {
                    return "red";
                } else if (value >= 500001 && value <= 2000000) {
                    return "orange";
                } else {
                    return "gray"; 
                }
            })
            .on("mouseover", function(d) {
                // Dim other countries
                d3.select(this)
                .style("opacity", 0.3)
                .transition()
                .duration(300)
                .attr("transform", "scale(1.1)");
            })
            .on("mouseout", function() {
                // Restore opacity\
                d3.select(this)
                .style("opacity", 1)
                .transition()
                .duration(300)
                .attr("transform", "scale(1)");
            });
    }).catch(function(error) {
        // Handle errors
        console.log("Error loading CSV:", error);
    });
}).catch(function(error) {
    // Handle errors
    console.log("Error loading GeoJSON:", error);
});
