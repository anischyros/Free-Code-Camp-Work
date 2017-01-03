
/*
 * Tooltip code adapted from example found at 
 * http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html.  Borrowed
 * with deep gratitude toward the author.
 */

$.ajax(
{
  url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  method: "GET",
  dataType: "json",
  crossDomain: true,
  success: onSuccess,
  error: onError
});

function onError(xhr)
{
  console.log("Error occurred");
  console.log(JSON.stringify(xhr));
}

var width = 900;
var height = 500;
var leftPadding = 100;
var rightPadding = 0;
var topPadding = 20;
var bottomPadding = 100;
var colors = ["violet", "blue", "cyan", "green", "yellow", "orange", "red", 
    "purple"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"];   
var heatScale;

function onSuccess(json)
{
    var baseTemp = json.baseTemperature;
    var data = json.monthlyVariance;
    var minYear = d3.min(data, function(d) { return d.year; });

    // Define scales.  We have three of them: two for x and y axes, and one
    // to work out the appropriate colors array index to represent heat.
    var xScale =
        d3.scale.linear()
            .domain([d3.min(data, function(d) { return d.year; }),
                d3.max(data, function(d) { return d.year; })])
            .range([0, width]);
    var yScale =
        d3.scale.linear()
            .domain([1, 12])
            .range([height, 0]);
    heatScale =
        d3.scale.linear()
            .domain([d3.min(data, function(d) { return d.variance; }),
                d3.max(data, function(d) { return d.variance; })])
            .range([0, 7])

    // Create <div> component for the tooltips
    var div = d3.select("body")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.0);

    // Define tooltip number formatter
    var formatter = d3.format(".2f");

    // Display the heat map itself
    var svg = d3.select("svg")
        .attr("width", leftPadding + width + rightPadding)
        .attr("height", topPadding + height + bottomPadding);
    console.log("height = " + (topPadding + height + bottomPadding));

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("stroke", "white")
            .attr("fill", function (d) {
                return colors[Math.floor(heatScale(d.variance))];})
            .attr("x", function(d) { return xScale(d.year) + leftPadding; })
            .attr("y", function(d) { return yScale(d.month) + topPadding; })
            .attr("width", xScale(minYear + 1) - xScale(minYear))
            .attr("height", yScale(1) - yScale(2))
            .on("mouseover", function(d) 
            {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(months[d.month - 1] + " " + d.year +
                    "<br />Temp: " + formatter(baseTemp + d.variance) + "C (" +
                    formatter((baseTemp + d.variance) * 9 / 5 + 32) + "F)" +
                    "<br />Variance: " + formatter(d.variance) + "C") 
                    .style("left", d3.event.pageX + "px")
                    .style("top", (d3.event.pageY - 28) + "px"); 
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0); });

    // Show the X axis
    var xAxis =
        d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10)
            .tickFormat(function(n) { return "" + n });
    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + leftPadding + ", " + 
                (height + topPadding + 47) + ")")
            .call(xAxis)
        .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .text("Year");

    // Show the Y axis
    var yAxis =
        d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(12)
            .tickFormat(function(n) { return months[n - 1] });
    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + leftPadding + ", " + 
                (topPadding + (yScale(1) - yScale(2)) / 2) + ")")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .text("Month of years");
}
