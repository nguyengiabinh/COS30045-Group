// Define projection settings
var projection = d3.geoMercator();

// Select the div with the class "map-container"
var mapContainer = d3.select(".map-container");

// Get the width and height of the map container
var containerWidth = mapContainer.node().getBoundingClientRect().width;
var containerHeight = mapContainer.node().getBoundingClientRect().height;

// Adjust projection settings based on container dimensions
var scale = containerWidth / 2.1; // Adjust the scale factor as needed
var translateX = containerWidth / 2.8;
var translateY = containerHeight / 1.8; // Adjust the vertical translation factor as needed

projection
  .center([0, 55]) // Adjust the center coordinates (longitude, latitude)
  .scale(scale)
  .translate([translateX, translateY]);

// Append the SVG element to the map container div
var svg = mapContainer
  .append("svg")
  .attr("class", "img1")
  .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`); // Use viewBox instead of fixed width and height

// Define path projection
var path = d3.geoPath()
  .projection(projection);

// Create a tooltip div specifically for the map
var mapTooltip = d3.select("body")
  .append("div")
  .attr("class", "map-tooltip") // Unique class for the map tooltip
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background-color", "white")
  .style("border", "1px solid black")
  .style("padding", "5px")
  .text("Tooltip");

// Load CSV data asynchronously
d3.csv("refugee.csv").then(function(data) {
  console.log("CSV data:", data); // Log CSV data to inspect it
  
  // Load JSON data asynchronously
  d3.json("europeUltra.json").then(function(json) {

    // Match the CSV data with the GeoJSON data
    for (var i = 0; i < data.length; i++) {
      var dataState = data[i].Name;
      var dataValue = parseInt(data[i]["Number "]); // Remove extra space after "Number"
      
      if (isNaN(dataValue)) {
        console.log("Failed to parse Number for:", dataState);
        continue; // Skip this iteration if parsing fails
      }

      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState === jsonState) {
          console.log("Matched:", dataState, dataValue);
          json.features[j].properties.value = dataValue;
          break; // Break the loop once matched
        }
      }
    }

    // Draw GeoJSON features with dynamic fill colors
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("stroke", "dimgray")
      .attr("fill", function(d) {
        // Determine color based on value
        var color = "lightgray"; 
        if (!isNaN(d.properties.value)) {
          if (d.properties.value < 100000) {
            color = "#CDF8FF";
          } else if (d.properties.value < 300000) {
            color = "#87CEEB";
          } else if (d.properties.value < 500000) {
            color = "#4169E1";
          } else if (d.properties.value < 1000000) {
            color = "#0000CD";
          } else {
            color = "#005180"; 
          }
        } else {
          color = "lightgray"; // No data available
        }
        return color;
      })
      .attr("d", path)
      .on("mouseover", function(event, d) {
        // Show mapTooltip with country name and number value
        mapTooltip.transition()
            .duration(200)
            .style("opacity", .9);
    
        // Change appearance on hover
        d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "tomato");
    
        // Update the mapTooltip position and value
        var numberValue = d.properties.value !== undefined ? d.properties.value : "Unavailable";
        mapTooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("visibility", "visible")
            .html("Name: " + d.properties.name + "<br/>Number: " + numberValue);
       })
      .on("mouseout", function(d) {
        mapTooltip.style("visibility", "hidden");
        
        // Revert appearance on mouseout
        d3.select(this)
          .attr("stroke", "dimgray")
          .attr("stroke-width", 1)
          .attr("fill", function(d) {
            // Determine color based on value
            var color = "lightgray"; 
            if (!isNaN(d.properties.value)) {
              if (d.properties.value < 100000) {
                color = "#CDF8FF";
              } else if (d.properties.value < 300000) {
                color = "#87CEEB";
              } else if (d.properties.value < 500000) {
                color = "#4169E1";
              } else if (d.properties.value < 1000000) {
                color = "#0000CD";
              } else {
                color = "#005180"; 
              }
            } else {
              color = "lightgray"; // No data available
            }
            return color;
          });
      });

    // Create a legend container
    var legendContainer = d3.select(".map-container")
      .append("div")
      .attr("class", "legend-container")
      .style("position", "absolute")
      .style("top", "20px")
      .style("left", "100px");

    // Add a legend title
    legendContainer.append("div")
      .attr("class", "legend-title")
      .text("Number of Refugees");

    // Define legend items
    var legendItems = [
      { label: "< 100,000", color: "#CDF8FF" },
      { label: "100,000 - 300,000", color: "#87CEEB" },
      { label: "300,000 - 500,000", color: "#4169E1" },
      { label: "500,000 - 1,000,000", color: "#0000CD" },
      { label: "> 1,000,000", color: "#005180" },
      { label: "Data Unavailable", color: "lightgray" }
    ];

    // Create legend elements
    var legend = legendContainer.selectAll(".legend-item")
      .data(legendItems)
      .enter()
      .append("div")
      .attr("class", "legend-item");

    legend.append("div")
      .attr("class", "legend-color")
      .style("background-color", function(d) { return d.color; });

    legend.append("span")
      .text(function(d) { return d.label; });
  }).catch(function(error) {
    // Handle errors
    console.log("Error loading GeoJSON:", error);
  });
}).catch(function(error) {
  // Handle errors
  console.log("Error loading CSV:", error);
});





