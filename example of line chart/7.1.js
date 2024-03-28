var w = 800;
var h = 380;
var padding = 50;
var dataset;
var dataset2;

// start the svg block
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "img");

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


function lineChart(dataset2) {
    // Set the x and y scale.
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
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset2, function(d) {
             return d.value; 
            })])
        .range([h - padding, padding]);

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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

    // X axis
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis
    svg.append("g")
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

    svg.append("path")
        .datum(dataset2)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none") // Changed to "none" for line chart
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5);

}

function btn2021() {
    // Remove existing elements from the SVG
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".hline").remove();
    svg.selectAll(".vline").remove();
    svg.selectAll("g").remove();

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
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svg.append("g")
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

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Append circles for each data point
    svg.selectAll(".circle-2021")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle-2021")
        .attr("cx", function(d) { 
            return xScale(d.month); 
        })
        .attr("cy", function(d) {
            return yScale(d["2021"]);
        })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);
}

function btn2022() {
    // Remove existing elements from the SVG
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".hline").remove();
    svg.selectAll(".vline").remove();
    svg.selectAll("g").remove();

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
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2021
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2022"]); 
        });

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Append circles for each data point
    svg.selectAll(".circle-2022")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle-2022")
        .attr("cx", function(d) { 
            return xScale(d.month); 
        })
        .attr("cy", function(d) { 
            return yScale(d["2022"]); 
        })
        .attr("r", 4)
        .style("fill", "#990000")
        .style("stroke-width", 0);
}

function btn2023() {
    // Remove existing elements from the SVG
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".hline").remove();
    svg.selectAll(".vline").remove();
    svg.selectAll("g").remove();

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
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2021
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2023"]); 
        });

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Append circles for each data point
    svg.selectAll(".circle-2023")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle-2023")
        .attr("cx", function(d) { 
            return xScale(d.month); 
        })
        .attr("cy", function(d) { 
            return yScale(d["2023"]); 
        })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);
}

function btn2024() {
    // Remove existing elements from the SVG
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".hline").remove();
    svg.selectAll(".vline").remove();
    svg.selectAll("g").remove();

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
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis position
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Draw lines for 2021
    var line = d3.line()
        .x(function(d) { 
            return xScale(d.month); 
        })
        .y(function(d) { 
            return yScale(d["2024"]); 
        });

    svg.append("path")
        .datum(dataset.filter(function(d) { 
            return d.month <= 3; 
        })) // Filter data for the first three months
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#4169E1")
        .style("stroke-width", 2.5); // Increase the stroke width to make the lines thicker

    // Append circles for each data point
    svg.selectAll(".circle-2024")
        .data(dataset.filter(function(d) { 
            return d.month <= 3; 
        })) // Filter data for the first three months
        .enter()
        .append("circle")
        .attr("class", "circle-2024")
        .attr("cx", function(d) { 
            return xScale(d.month); 
        })
        .attr("cy", function(d) { 
            return yScale(d["2024"]); 
        })
        .attr("r", 4)
        .style("fill", "#000080")
        .style("stroke-width", 0);
}

function Reset() {
    // Remove existing elements from the SVG
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".hline").remove();
    svg.selectAll(".vline").remove();
    svg.selectAll("g").remove();


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
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset2, function(d) { 
            return d.value; 
        })])
        .range([h - padding, padding]);

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw horizontal gridlines
    svg.selectAll(".hline")
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
    svg.selectAll(".vline")
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

    // X axis
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Y axis
    svg.append("g")
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

    svg.append("path")
        .datum(dataset2)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none") // Changed to "none" for line chart
        .style("stroke", "#CC0000")
        .style("stroke-width", 2.5);

    
}








