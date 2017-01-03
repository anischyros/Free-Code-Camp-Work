/*
 * World map generated courtesy of https://geojson-maps.kyd.com.au.
 */
var width = 2000;
var height = 1000;
var worldJson, meteorJson;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.equirectangular()
    .translate([width / 2, height / 2])
    .scale([300]);

var path = d3.geo.path()
    .projection(projection);

var tooltip = d3.select(".tooltip");

d3.json("https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/world.geo.json", worldLoaded);

function worldLoaded(json)
{
    worldJson = json;

    svg.selectAll("path")
        .data(worldJson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "blue")
        .style("fill", "cyan");

    d3.json("https://raw.githubusercontent.com/FreeCodeCamp/" +
        "ProjectReferenceData/master/meteorite-strike-data.json", 
        meteorDataLoaded);
}

function meteorDataLoaded(meteorJson)
{
    svg.selectAll("circle")
        .data(meteorJson.features)
        .enter()
        .append("circle")
            .attr("cx", function(d) {
                return projection([d.properties.reclong, 
                    d.properties.reclat])[0]; })
            .attr("cy", function(d) {
                return projection([d.properties.reclong, 
                    d.properties.reclat])[1]; })
            .attr("r", function(d) {
                return Math.max(Math.pow(d.properties.mass / 100, 1/3), 5); })
            .style("stroke", "white")
            .style("fill", "orange")
            .style("opacity", 0.5)
        .append("title")
            .text(function(d)
            {
                return "Where: " + d.properties.name + 
                    ".  When: " + ("" + d.properties.year).substring(0, 4);
            });
}

