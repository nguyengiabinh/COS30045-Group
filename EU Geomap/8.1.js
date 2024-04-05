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

// Thêm tính năng zoom
const zoom = d3.zoom()
  .scaleExtent([1, 8]) // Giới hạn scale từ 1 đến 8
  .on('zoom', function(event) {
    g.attr('transform', event.transform);
  });

svg.call(zoom);

// Thêm container <g> để chứa các thành phần của bản đồ
const g = svg.append('g');

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

    // Draw GeoJSON features bên trong container <g>
    g.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("stroke", "dimgray")
      .attr("d", path)
      .style("fill", function (d) {
        const countryName = d.properties.name;
        const value = dataMap[countryName];
        if (value >= 1 && value <= 100000) {
          return "#4cc3e0";
        } else if (value >= 100001 && value <= 500000) {
          return "#4690a3";
        } else if (value >= 500001 && value <= 2000000) {
          return "#297d91";
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
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
        tooltip.style("visibility", "hidden");
      });
  })
  // Define legend data
const legendData = [
  { label: "1 - 100,000", color: "#4cc3e0" },
  { label: "100,001 - 500,000", color: "#4690a3" },
  { label: "500,001 - 2,000,000", color: "#297d91" },
  { label: "No Data", color: "gray" }
];

// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(20, 20)"); // Adjust position as needed

legend.selectAll("rect")
  .data(legendData)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", function(d, i) { return i * 25; })
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", function(d) { return d.color; });

legend.selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .attr("x", 30)
  .attr("y", function(d, i) { return i * 25 + 14; })
  .text(function(d) { return d.label; })
  .attr("font-size", "14px")

  .catch(function (error) {
    // Handle errors
    console.log("Error loading data:", error);
  });
