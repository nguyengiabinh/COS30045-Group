var w = 800;
var h = 500;
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
    var colors = [
        "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500",
        "#800080", "#FFC0CB", "#00FFFF", "#FF00FF", "#008080",
        "#00FF00", "#800000", "#000080", "#808000", "#00FFFF",
        "#FF7F50", "#4B0082", "#FFD700", "#C0C0C0", "#FF1493",
        "#8A2BE2", "#7FFF00", "#FF4500", "#483D8B", "#20B2AA"
    ];

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

    var lastColorIndex = -1; // Initialize with -1 to start from the first color

    // Draw the circle itself
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + centerX + "," + centerY + ")");

        arcs.append("path")
        .attr("d", function (d, i) {
            return arc(d, i);
        })
        .attr("fill", function(d, i) {
            lastColorIndex = (lastColorIndex + 1) % colors.length; // Move to the next color index
            return colors[lastColorIndex]
        })
        .on("mouseover", function (event, d, i) {
            d3.select(this).transition()
                .duration(100)
                .attr("opacity", 0.7);
    
            // Show value and color code on hover
            svg.append("text")
                .attr("class", "hover-label")
                .attr("transform", "translate(" + centerX + "," + centerY + ")")
                .attr("text-anchor", "middle")
                .text(((d.data / d3.sum(dataset)) * 100).toFixed(2) + "%");
        })
        .on("mouseout", function () {
            d3.select(this).transition()
                .duration(100)
                .attr("opacity", 1);
    
            // Remove the hover label on mouseout
            svg.select(".hover-label").remove();
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
        .attr("class", "hover-rect")
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {
            return colors[i % colors.length]; // Assign color based on index
        });

        legend.on("mouseover", function (event, d, i) {
            // Show text label on hover
            d3.select(this).append("text")
                .attr("class", "hover-label")
                .attr("x", w - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                    return d.replace(/\ufffd/g, ''); // Replace all occurrences of U+00a0 with an empty string
                });
        })
        .on("mouseout", function () {
            // Remove the text label on mouseout
            d3.select(this).select(".hover-label").remove();
        });
});
