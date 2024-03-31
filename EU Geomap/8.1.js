const w = 1000;
const h = 1000;

// Define projection settings
const projection = d3
  .geoMercator()
  .center([0, 25]) // Centering the map
  .scale(720) // Adjusting scale to make the map four times bigger
  .translate([w / 2.5, h]);

const path = d3.geoPath().projection(projection);

// Start the SVG block
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "img");

// Create a div tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");

// Load and render GeoJSON data and CSV data
Promise.all([d3.json("europe_.geojson"), d3.csv("data.csv")])
  .then(function (files) {
    const json = files[0];
    const csvData = files[1];

    // Create a dictionary to map country names to data values
    const dataMap = {};
    csvData.forEach(function (d) {
      dataMap[d.countryname.trim()] = +d.number; // Trimming whitespace from country name and converting number to numeric type
    });

    // Draw GeoJSON features
    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("stroke", "dimgray")
      .attr("d", path)
      .style("fill", function (d) {
        const countryName = d.properties.name;
        const value = dataMap[countryName];
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
      .on("mouseover", function (event, d) {
        const countryName = d.properties.name;
        const value = dataMap[countryName];
        d3.select(this)
          .style("transform-origin", "center center")

          .transition()
          .duration(300)
          .attr("transform", "scale(1.1)");
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .style("visibility", "visible")
          .text(countryName + ": " + value);
      })

      .on("mouseout", function () {
        d3.select(this)
          .style("opacity", 1)

          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
        tooltip.style("visibility", "hidden");
      });
  })
  .catch(function (error) {
    // Handle errors
    console.log("Error loading data:", error);
  });
