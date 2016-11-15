"use strict";

var data =
    "cpu,mem\r\n" +
    "0.15,1.5\r\n" +
    "0.22,4.5\r\n" +
    "0.27,5.5\r\n" +
    "0.14,6.0\r\n" +
    "0.16,6.5\r\n" +
    "0.15,6.5\r\n" +
    "0.18,6.6\r\n" +
    "0.17,6.6\r\n" +
    "0.17,6.6\r\n" +
    "0.18,6.6\r\n" +
    "0.20,6.6\r\n" +
    "0.19,6.7\r\n" +
    "0.22,6.8\r\n" +
    "0.20,6.9\r\n" +
    "0.21,6.9";

// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 70, bottom: 30, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(d3.time.second, 60).tickFormat(d3.time.format("%H:%M:%S"));

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var cpuLine = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.cpu); });

var memLine = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.mem); });

var now = new Date();

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var rows = data.split("\r\n").splice(1);

for (var row = 0; row < rows.length; row++) {
    var date = new Date(now);
    date.setSeconds(now.getSeconds() + row * 30);
    var items = rows[row].split(",");
    rows[row] = {
        date: date,
        cpu: +items[0],
        mem: +items[1]
    };
}

// Scale the range of the data
x.domain(d3.extent(rows, function (d) { return d.date; }));
y.domain([0, d3.max(rows, function (d) { return d.mem; })]);

var color = d3.scale.category10();

svg.append("path")
    .attr("class", "line")
    .style("stroke", function () {
        return color("cpu");
    })
    .attr("d", cpuLine(rows));

svg.append("path")
    .attr("class", "line")
    .style("stroke", function () {
        return color("mem");
    })
    .attr("d", memLine(rows));

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var legendRectSize = 18;
var legendSpacing = 4;

var legend = svg.selectAll('.legend')
    .data(["cpu", "mem"])
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var horz = width + 5;
        var vert = i * height;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', function (d) {
      return color(d);
  })
  .style('stroke', function (d) {
      return color(d);
  });

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function (d) { return d; });