$.ajax(
{
  url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
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

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"];

function dataEntry2Tooltip(entry)
{
    // Parse date
    var a = entry[0].split("-");
    var date = months[a[1] - 1] + " " + Number(a[0]);

    if (entry[1] < 1000)
        var gdp = " -- $" + entry[1] + " billion";
    else
    {
        var s = "" + entry[1];
        var ndx = s.indexOf(".");
        if (ndx < 0)
            ndx = s.length - 3;
        else
            ndx -= 3;   
        s = s.replace(".", "");
        s = s.substring(0, ndx) + "." + s.substring(ndx);
        var gdp = "$" + s + " trillion";
    }

    return date + " - " + gdp;
}

function onSuccess(json)
{
    var data;
    var xScale, yScale;
    var width = 900;
    var height = 500;
    var barPadding = 1;
    var topPadding = 25;
    var xAxisOffset = 50;
    var yAxisOffset = 75;

    data = json.data;
    xScale =
        d3.scale.linear()
            .domain([0, data.length])
            .range([0, width]);
    var yScale = 
        d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[1]; })])
            .range([height, 0]);

    var yAxis =
        d3.svg.axis()
            .scale(yScale)
            .orient("left");

    var xAxisScale =
        d3.scale.linear()
            .domain([d3.min(data, function(d) { 
                    return Number(d[0].split("-")[0]); }),
                 d3.max(data, function(d) {
                    return Number(d[0].split("-")[0]); } )
                ])
            .range([0, width]);
    var xAxis =
        d3.svg.axis()
            .scale(xAxisScale)
            .orient("bottom")
            .tickFormat(d3.format("4d"));

    var svg = 
        d3.select("svg")
            .attr("width", width + yAxisOffset)
            .attr("height", height + xAxisOffset * 2);

   svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("stroke", "black")
            .attr("fill", "blue")
            .attr("x", function(d, i) 
                { return xScale(i) + yAxisOffset; })
            .attr("y", function(d) { return yScale(d[1]) + topPadding; })
            .attr("width", xScale(1) - barPadding)
            .attr("height", function(d) { return height - yScale(d[1]); })
        .append("title")
            .text(dataEntry2Tooltip);
    
    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + yAxisOffset + ", " +
                (height + topPadding + 5) + ")")
            .call(xAxis);

    svg.append("g")
            .attr("class", "axis")
            .attr("transform", 
                "translate(" + yAxisOffset + ", " + topPadding +")")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("GDP (in billions of $)");        

    $("#source-info").html(json.description.replace("\n", "<br />"));
}

