$.ajax(
{
  url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
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

function onSuccess(data)
{
    var width = 900;
    var height = 500;
    var leftPadding = 100;
    var rightPadding = 125;
    var topPadding = 20;
    var bottomPadding = 75;
    var ratio = 5;

    var xScale =
        d3.scale.linear()
            .domain([d3.min(data, function(d) { return d.Seconds }) - 10, 
                d3.max(data, function(d) { return d.Seconds }) + 10])
            .range([width, 0]);

    var yScale = 
        d3.scale.linear()
            .domain([d3.min(data, function(d) { return d.Place} ),
                d3.max(data, function(d) { return d.Place} )])
            .range([0, height]);

    var yAxis = 
        d3.svg.axis()
            .scale(yScale)
            .orient("left");

    var xAxis =
        d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function(sec) {
                return Math.floor(sec / 60) + (sec % 60 < 10 ? ":0" : ":") + 
                    sec % 60; } );
    
    var svg = d3.select("svg")
        .attr("width", leftPadding + width + rightPadding)
        .attr("height", topPadding + height + bottomPadding);
    
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("svg:circle")
            .attr("stroke", "gray")
            .attr("fill", function(d) { return !d.Doping ? "gray" : "red" })    
            .attr("cx", function(d) { return xScale(d.Seconds) + leftPadding; })
            .attr("cy", function(d) { return yScale(d.Place) + topPadding; })
            .attr("r", ratio)
        .append("svg:title")
            .text(function(d) { return d.Doping && d.Doping.trim().length > 0 ?
                d.Doping : "No doping allegations"; });

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("svg:text")
            .text(function(d) { return d.Name; })
            .attr("class", "cyclist")
            .attr("x", function(d) { 
                return xScale(d.Seconds) + leftPadding + ratio + 10; })
            .attr("y", function(d) { 
                return yScale(d.Place) + topPadding + 5; })
        .append("svg:title")
            .text(function(d) { 
                return "Nationality: " + d.Nationality + "; Year: " +
                    d.Year + "; Time: " + (Math.floor(d.Seconds / 60) + ":" + 
                    (d.Seconds % 60 < 10 ? "0" : "") + d.Seconds % 60); });
    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + leftPadding + ", " + 
                topPadding + ")")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Place");

    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + leftPadding + ", " + 
                (topPadding + height + 20) + ")")
            .call(xAxis)
        .append("text")
            .attr("x", width)
            .attr("y", 40)
            .style("text-anchor", "end")
            .text("Time to complete heat");
}

