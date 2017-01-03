$.ajax(
{
  url: "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
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

function onSuccess(json)
{
    var width = 1000;
    var height = 800;

    // Create reference to <SVG> tags.
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Initialize force graph system
    var force =
        d3.layout.force()
            .nodes(json.nodes)
            .links(json.links)
            .size([width, height])
            .linkDistance([60])
            .charge(-100)
            .start();
    
    // Define edges (the links between flags)
    var edges =
        svg.selectAll("line")
            .data(json.links)
            .enter()
            .append("line")
            .style("stroke", "black")
            .style("stroke-width", 1);
    
    // Define the nodes (the flags themselves)
    var nodes =
        d3.select(".flags")
            .selectAll("link")
            .data(json.nodes)
            .enter()
            .append("img")
            .attr("class", function(d) { return "flag flag-" + d.code })
            .attr("title", function(d) { return d.country; });
  
    // Turn on the dragging capability
    nodes.call(force.drag); 
    
    // Define the tick function.  This function will dynamically recompute the 
    // positions for each nodes and edges for the graph.  It is also necessary
    // in order for the node and edge positions to be computed initially.
    force.on("tick", function()
    {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        nodes.style("left", function(d) { return d.x - 8 + "px"; })
            .style("top", function(d) { return d.y - 8 + "px"; });
    });

}

