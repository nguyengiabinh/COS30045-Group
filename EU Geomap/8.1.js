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

// Load and render GeoJSON data
Promise.all([d3.json("europe_.geojson"), d3.csv("Book1.csv")])
  .then(function (files) {
    const json = files[0];
    const data = [
      { countryname: "Poland", number: 1640510 },
      { countryname: "Russia", number: 1212585 },
      { countryname: "Ukraine", number: 1212585 },
      { countryname: "Serbia", number: 77474 },
      { countryname: "Macedonia", number: 25713 },
      { countryname: "Germany", number: 1125950 },
      { countryname: "Czech Republic", number: 547670 },
      { countryname: "United Kingdom", number: 21080 },
      { countryname: "Spain", number: 186045 },
      { countryname: "Bulgaria", number: 168570 },
      { countryname: "Italy", number: 163570 },
      { countryname: "Moldova", number: 116615 },
      { countryname: "Romania", number: 106786 },
      { countryname: "Slovakia", number: 107415 },
      { countryname: "Netherlands", number: 94415 },
      { countryname: "Ireland", number: 91330 },
      { countryname: "Austria", number: 81870 },
      { countryname: "France", number: 70570 },
      { countryname: "Belgium", number: 700435 },
      { countryname: "Switzerland", number: 65555 },
      { countryname: "Estonia", number: 63850 },
      { countryname: "Finland", number: 61060 },
      { countryname: "Portugal", number: 56995 },
      { countryname: "Lithuania", number: 48425 },
      { countryname: "Sweden", number: 56165 },
      { countryname: "Norway", number: 56970 },
      { countryname: "Latvia", number: 43592 },
      { countryname: "Turkey", number: 41390 },
      { countryname: "Denmark", number: 41155 },
      { countryname: "Montenegro", number: 37050 },
      { countryname: "Belarus", number: 37000 },
      { countryname: "Hungary", number: 33316 },
      { countryname: "Georgia", number: 27000 },
      { countryname: "Greece", number: 25050 },
      { countryname: "Croatia", number: 23035 },
      { countryname: "Cyprus", number: 18225 },
      { countryname: "North Macedonia", number: 17315 },
      { countryname: "Slovenia", number: 10140 },
      { countryname: "Luxembourg", number: 6065 },
      { countryname: "Albania", number: 7495 },
      { countryname: "Azerbaijan", number: 4555 },
      { countryname: "Serbia and Kosovo", number: 4245 },
      { countryname: "Iceland", number: 3910 },
      { countryname: "Malta", number: 2115 },
      { countryname: "Armenia", number: 605 },
      { countryname: "Liechtenstein", number: 580 },
      { countryname: "Bosnia and Herzegovina", number: 215 },
    ];

    // Create a dictionary to map country names to data values
    const dataMap = {};
    data.forEach(function (d) {
      dataMap[d.countryname.trim()] = d.number; // Trimming whitespace from country name
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
