var padding = 30;
var dataset;
var dataset2;

// Select the div with the class "map-container"
var lineContainer = d3.select(".line-container");

// Get the width and height of the line container
var containerWidth = lineContainer.node().getBoundingClientRect().width;
var buttonColumnHeight = d3.select(".buttons").node().getBoundingClientRect().height;

// Adjust projection settings based on container dimensions
var scale = containerWidth; // Adjust the scale factor as needed

var w = containerWidth;
var h = buttonColumnHeight;

// Append the SVG element to the map container div
var svgline = lineContainer
  .append("svg")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("class", "img1")
  .attr("viewBox", `0 0 ${containerWidth} ${h}`);
//   .attr("width", w)
//   .attr("height", h) // Use viewBox instead of fixed width and height


//returning the value of date and number field
d3.csv("migration from ukraine 2021-2024.csv", function(d) {
    return {
        month: +d.month,
        "2021": +d["2021"],
        "2022": +d["2022"],
        "2023": +d["2023"],
        "2024": +d["2024"]
    };
}).then(function(data) {
    dataset = data;
    lineChart(dataset);
});

d3.csv("migration in a different format.csv", function(d) {
    return {
        date: new Date(+d.year, +d.months),
        value: +d.value
    };
}).then(function(data) {
    dataset2 = data; // Assign data to dataset2
    lineChart(dataset2);
});


// Function to create a line chart with gridlines, axes, and tooltips
function lineChart(dataset2) {
    // Set the x and y scale.
    var xScale = d3.scaleTime()
        .domain([
            d3.min(dataset2, function(d) { 
                return d.date; 
            }),
            d3.max(dataset2, function(d) { 
                return d.date; 
            })
        ])
        .range([padding, w - padding]); // Adjusted range for xScale

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset2, function(d) { return d.value; })])
        .range([h - padding, padding]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(4);

    var yAxis = d3.axisRight()
        .scale(yScale);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) { return yScale(d); })
        .attr("y2", function(d) { return yScale(d); })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { return xScale(d); })
        .attr("x2", function(d) { return xScale(d); })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw line
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.date); 
        }) 
        .y(function(d) { 
            return yScale(d.value); 
        });

    svgline.append("path")
        .datum(dataset2)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5);

    // Add a tooltip div for displaying data points
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .text("Tooltip");

    // Add event listener for mousemove
    svgline.on("mousemove", function(event) {
        // Get the mouse coordinates relative to the SVG
        var mouseX = event.clientX - this.getBoundingClientRect().left;
        var mouseY = event.clientY - this.getBoundingClientRect().top;

        // Find the closest data point
        var closestPoint = dataset2.reduce(function(prevPoint, currPoint) {
            var prevDist = xScale(prevPoint.date) - mouseX;
            var currDist = xScale(currPoint.date) - mouseX;
            return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
        });

        // Add a circle at the closest data point
        var circle = svgline.selectAll(".circle")
            .data([closestPoint])
            .join("circle")
            .attr("class", "circle")
            .attr("cx", function(d) { return xScale(d.date); })
            .attr("cy", function(d) { return yScale(d.value); })
            .attr("r", 5)
            .style("fill", "steelblue")
            .style("stroke", "black")
            .style("stroke-width", 1);

        // Update the tooltip position and value
        tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("visibility", "visible")
            .html("Date: " + closestPoint.date.toDateString() + "<br/>Value: " + closestPoint.value);
    })
    .on("mouseout", function() {
        svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
        tooltip.style("visibility", "hidden");
    });

}




function btn2021() {
    // Remove existing elements from the SVG
    svgline.selectAll(".line").remove();
    svgline.selectAll("circle").remove();
    svgline.selectAll(".hline").remove();
    svgline.selectAll(".vline").remove();
    svgline.selectAll("g").remove();
    d3.select(".tooltip").remove();

    // Set the x and y scale.
    var xScale = d3.scaleLinear()
        .domain([1, 12]) // Assuming data is for 12 months
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d3.max([d["2021"]]);
        }) * 1.1]) // Increase the domain by 10% to add buffer space
        .range([h - padding, padding]);

    // Create a x bottom axis line
    var xAxis = d3.axisBottom()
        .scale(xScale);

    // Create a Left-hand side y axis
    var yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(4);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) { 
            return yScale(d); 
        })
        .attr("y2", function(d) { 
            return yScale(d); 
        })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { 
            return xScale(d); 
        })
        .attr("x2", function(d) { 
            return xScale(d); 
        })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis position
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2021
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2021"]); 
        });

    // Draw line
    svgline.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

        // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2021"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);

  // Add a tooltip div for displaying data points
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .text("Tooltip");

  // Add event listener for mousemove
  svgline.on("mousemove", function(event) {
    // Get the mouse coordinates relative to the SVG
    var mouseX = event.clientX - this.getBoundingClientRect().left;
    var mouseY = event.clientY - this.getBoundingClientRect().top;

    // Find the closest data point
    var closestPoint = dataset.reduce(function(prevPoint, currPoint) {
      var prevDist = xScale(prevPoint.month) - mouseX;
      var currDist = xScale(currPoint.month) - mouseX;
      return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
    });

    // Add a circle at the closest data point
    var circle = svgline.selectAll(".circle")
      .data([closestPoint])
      .join("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return xScale(d.month); })
      .attr("cy", function(d) { return yScale(d["2021"]); })
      .attr("r", 5)
      .style("fill", "steelblue")
      .style("stroke", "black")
      .style("stroke-width", 1);

    // Update the tooltip position and value
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("visibility", "visible")
      .html("Month: " + closestPoint.month + "<br/>Number: " + closestPoint["2021"]);
  })
  .on("mouseout", function() {
    svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
    // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2021"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);
    tooltip.style("visibility", "hidden");

  });
}

function btn2022() {
    // Remove existing elements from the SVG
    svgline.selectAll(".line").remove();
    svgline.selectAll("circle").remove();
    svgline.selectAll(".hline").remove();
    svgline.selectAll(".vline").remove();
    svgline.selectAll("g").remove();
    d3.select(".tooltip").remove();

    // Set the x and y scale.
    var xScale = d3.scaleLinear()
        .domain([1, 12]) // Assuming data is for 12 months
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d3.max([d["2022"]]);
        }) * 1.1]) // Increase the domain by 10% to add buffer space
        .range([h - padding, padding]);

    // Create a x bottom axis line
    var xAxis = d3.axisBottom()
        .scale(xScale);

    // Create a Left-hand side y axis
    var yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(4);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) { 
            return yScale(d); 
        })
        .attr("y2", function(d) { 
            return yScale(d); 
        })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { 
            return xScale(d); 
        })
        .attr("x2", function(d) { 
            return xScale(d); 
        })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis position
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2022
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2022"]); 
        });

    svgline.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2022"]); })
        .attr("r", 4)
        .style("fill", "#CC0000")
        .style("stroke-width", 0);

  // Add a tooltip div for displaying data points
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .text("Tooltip");

  // Add event listener for mousemove
  svgline.on("mousemove", function(event) {
    // Get the mouse coordinates relative to the SVG
    var mouseX = event.clientX - this.getBoundingClientRect().left;
    var mouseY = event.clientY - this.getBoundingClientRect().top;

    // Find the closest data point
    var closestPoint = dataset.reduce(function(prevPoint, currPoint) {
      var prevDist = xScale(prevPoint.month) - mouseX;
      var currDist = xScale(currPoint.month) - mouseX;
      return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
    });

    // Add a circle at the closest data point
    var circle = svgline.selectAll(".circle")
      .data([closestPoint])
      .join("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return xScale(d.month); })
      .attr("cy", function(d) { return yScale(d["2022"]); })
      .attr("r", 5)
      .style("fill", "steelblue")
      .style("stroke", "black")
      .style("stroke-width", 1);

    // Update the tooltip position and value
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("visibility", "visible")
      .html("Month: " + closestPoint.month + "<br/>Number: " + closestPoint["2022"]);
  })
  .on("mouseout", function() {
    svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
            // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2022"]); })
        .attr("r", 4)
        .style("fill", "#CC0000")
        .style("stroke-width", 0);

    tooltip.style("visibility", "hidden");
  });
}

function btn2023() {
    // Remove existing elements from the SVG
    svgline.selectAll(".line").remove();
    svgline.selectAll("circle").remove();
    svgline.selectAll(".hline").remove();
    svgline.selectAll(".vline").remove();
    svgline.selectAll("g").remove();
    d3.select(".tooltip").remove();

    // Set the x and y scale.
    var xScale = d3.scaleLinear()
        .domain([1, 12]) // Assuming data is for 12 months
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d3.max([d["2023"]]);
        }) * 1.1]) // Increase the domain by 10% to add buffer space
        .range([h - padding, padding]);

    // Create a x bottom axis line
    var xAxis = d3.axisBottom()
        .scale(xScale);

    // Create a Left-hand side y axis
    var yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(4);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) {
            return yScale(d); 
        })
        .attr("y2", function(d) { 
            return yScale(d); 
        })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { 
            return xScale(d); 
        })
        .attr("x2", function(d) { 
            return xScale(d); 
        })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis position
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2023
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2023"]); 
        });

    svgline.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2023"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);

  // Add a tooltip div for displaying data points
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .text("Tooltip");

  // Add event listener for mousemove
  svgline.on("mousemove", function(event) {
    // Get the mouse coordinates relative to the SVG
    var mouseX = event.clientX - this.getBoundingClientRect().left;
    var mouseY = event.clientY - this.getBoundingClientRect().top;

    // Find the closest data point
    var closestPoint = dataset.reduce(function(prevPoint, currPoint) {
      var prevDist = xScale(prevPoint.month) - mouseX;
      var currDist = xScale(currPoint.month) - mouseX;
      return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
    });

    // Add a circle at the closest data point
    var circle = svgline.selectAll(".circle")
      .data([closestPoint])
      .join("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return xScale(d.month); })
      .attr("cy", function(d) { return yScale(d["2023"]); })
      .attr("r", 5)
      .style("fill", "steelblue")
      .style("stroke", "black")
      .style("stroke-width", 1);

    // Update the tooltip position and value
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("visibility", "visible")
      .html("Month: " + closestPoint.month + "<br/>Number: " + closestPoint["2023"]);
  })
  .on("mouseout", function() {
    svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
        // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2023"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);
    tooltip.style("visibility", "hidden");
  });
}

function btn2024() {
    // Remove existing elements from the SVG
    svgline.selectAll(".line").remove();
    svgline.selectAll("circle").remove();
    svgline.selectAll(".hline").remove();
    svgline.selectAll(".vline").remove();
    svgline.selectAll("g").remove();
    d3.select(".tooltip").remove();

    // Set the x and y scale.
    var xScale = d3.scaleLinear()
        .domain([1, 12]) // Limiting to the first three months
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d3.max([d["2024"]]);
        }) * 1.1]) // Increase the domain by 10% to add buffer space
        .range([h - padding, padding]);

    // Create a x bottom axis line
    var xAxis = d3.axisBottom()
        .scale(xScale);

    // Create a Left-hand side y axis
    var yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(4);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) { 
            return yScale(d); 
        })
        .attr("y2", function(d) { 
            return yScale(d); 
        })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { 
            return xScale(d); 
        })
        .attr("x2", function(d) { 
            return xScale(d); 
        })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis position
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2024
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2024"]); 
        });

    svgline.append("path")
        .datum(dataset.filter(function(d) { 
            return d.month <= 3; 
        })) // Filter data for the first three months
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

        // Draw circles
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2024"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);

  // Add a tooltip div for displaying data points
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .text("Tooltip");

  // Add event listener for mousemove
  svgline.on("mousemove", function(event) {
    // Get the mouse coordinates relative to the SVG
    var mouseX = event.clientX - this.getBoundingClientRect().left;
    var mouseY = event.clientY - this.getBoundingClientRect().top;

    // Find the closest data point
    var closestPoint = dataset.reduce(function(prevPoint, currPoint) {
      var prevDist = xScale(prevPoint.month) - mouseX;
      var currDist = xScale(currPoint.month) - mouseX;
      return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
    });

    // Add a circle at the closest data point
    var circle = svgline.selectAll(".circle")
      .data([closestPoint])
      .join("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return xScale(d.month); })
      .attr("cy", function(d) { return yScale(d["2024"]); })
      .attr("r", 5)
      .style("fill", "steelblue")
      .style("stroke", "black")
      .style("stroke-width", 1);

    // Update the tooltip position and value
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("visibility", "visible")
      .html("Month: " + closestPoint.month + "<br/>Number: " + closestPoint["2024"]);
  })
  .on("mouseout", function() {
    svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
    svgline.selectAll(".circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) { return xScale(d.month); })
        .attr("cy", function(d) { return yScale(d["2024"]); })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);

    tooltip.style("visibility", "hidden");
  });
}

function Reset() {
    // Remove existing elements from the SVG
    svgline.selectAll(".line").remove();
    svgline.selectAll("circle").remove();
    svgline.selectAll(".hline").remove();
    svgline.selectAll(".vline").remove();
    svgline.selectAll("g").remove();
    d3.select(".tooltip").remove();


    // Set the x and y scale.
    var xScale = d3.scaleTime()
        .domain([
            d3.min(dataset2, function(d) { 
                return d.date; 
            }),
            d3.max(dataset2, function(d) { 
                return d.date; 
            })
        ])
        .range([padding, w - padding]); // Adjusted range for xScale

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset2, function(d) { return d.value; })])
        .range([h - padding, padding]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(4);

    var yAxis = d3.axisRight()
        .scale(yScale);

    // Draw horizontal gridlines
    svgline.selectAll(".hline")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "hline")
        .attr("x1", padding)
        .attr("x2", w - padding)
        .attr("y1", function(d) { return yScale(d); })
        .attr("y2", function(d) { return yScale(d); })
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // Draw vertical gridlines
    svgline.selectAll(".vline")
        .data(xScale.ticks())
        .enter().append("line")
        .attr("class", "vline")
        .attr("x1", function(d) { return xScale(d); })
        .attr("x2", function(d) { return xScale(d); })
        .attr("y1", padding)
        .attr("y2", h - padding)
        .style("stroke", "#ddd")
        .style("stroke-width", 0.5);

    // X axis
    svgline.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis
    svgline.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw line
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.date); 
        }) 
        .y(function(d) { 
            return yScale(d.value); 
        });

    svgline.append("path")
        .datum(dataset2)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5);

    // Add a tooltip div for displaying data points
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .text("Tooltip");

    // Add event listener for mousemove
    svgline.on("mousemove", function(event) {
        // Get the mouse coordinates relative to the SVG
        var mouseX = event.clientX - this.getBoundingClientRect().left;
        var mouseY = event.clientY - this.getBoundingClientRect().top;

        // Find the closest data point
        var closestPoint = dataset2.reduce(function(prevPoint, currPoint) {
            var prevDist = xScale(prevPoint.date) - mouseX;
            var currDist = xScale(currPoint.date) - mouseX;
            return (Math.abs(currDist) < Math.abs(prevDist) ? currPoint : prevPoint);
        });

        // Add a circle at the closest data point
        var circle = svgline.selectAll(".circle")
            .data([closestPoint])
            .join("circle")
            .attr("class", "circle")
            .attr("cx", function(d) { return xScale(d.date); })
            .attr("cy", function(d) { return yScale(d.value); })
            .attr("r", 5)
            .style("fill", "steelblue")
            .style("stroke", "black")
            .style("stroke-width", 1);

        // Update the tooltip position and value
        tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("visibility", "visible")
            .html("Date: " + closestPoint.date.toDateString() + "<br/>Value: " + closestPoint.value);
    })
    .on("mouseout", function() {
        svgline.selectAll(".circle").remove(); // Hide the tooltip and remove the circle
        tooltip.style("visibility", "hidden");
    });
    
}








