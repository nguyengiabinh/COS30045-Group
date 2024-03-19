var w = 800;
var h = 380;
var padding = 50;

// Initialize the dataset
var dataset = [];

// Load data from CSV file
d3.csv("event_data_pse.csv").then(function(data) {
    // Extract values from the specific column
    var columnData = data.map(function(d) {
        return d.event_name;
    });

    // Count occurrences of each unique value
    var counts = {};
    columnData.forEach(function(d) {
        counts[d] = (counts[d] || 0) + 1;
    });

    // Prepare data for the pie chart
    dataset = Object.values(counts);

    // Color scale for the chart
    var colorScale = d3.scaleOrdinal()
        .domain(Object.keys(counts))
        .range(d3.schemeCategory10);

    // Calculate the center of the pie chart
    var centerX = w / 2;
    var centerY = h / 2;

    // Start the svg block
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "img");

    // Initialize the radius for the pie chart
    var outerRadius = w / 5;
    var innerRadius = 50;

    // Tell D3 how to draw each slice of the circle
    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var pie = d3.pie();

    // Draw the circle itself
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + centerX + "," + centerY + ")");

    // Draw out the circle by calling arcs
    arcs.append("path")
        .attr("d", function(d, i) {
            return arc(d, i);
        })
        .attr("fill", function(d, i) {
            return colorScale(Object.keys(counts)[i]);
        });

    // Add tooltips
    arcs.append("title")
        .text(function(d, i) {
            return Object.keys(counts)[i] + ": " + dataset[i];
        });

    // Add legend
    var legend = svg.selectAll(".legend")
        .data(Object.keys(counts))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {
            return colorScale(d);
        });

    legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });
});






