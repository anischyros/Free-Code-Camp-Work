// List of channels to check
var channels = ["nl_kripp", "freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "anischyros", "brunofin", "comster404", "Otzdarva"];
var clientId = "gpztbp2j75cwf978vtrsle61u1xl0lo";
var channelInfo = new Object();

channels.forEach(function(channel)
{
  $.ajax(
  {
    url: "https://api.twitch.tv/kraken/channels/" + channel,
    method: "GET",
    crossDomain: true,
    dataType: "jsonp",
    accepts:
    {
      twitch_json: "application/vnd.twitchtv.v3+json"
    },
    data:
    {
      client_id: clientId
    },
    success: function(response)
    {
      updateChannelInfo(response, channel);
    },
    error: function(data) 
    { 
      console.error(JSON.stringify(data)); 
    },
    complete: function(xhr, status)
    {
      if (status == "success" && !xhr.responseJSON.error)
        updateStatusInfo(xhr.responseJSON.name);
      else
        $("#" + channel + "-row").addClass("non-existent");
    }
  });
});

function updateChannelInfo(response, channel)
{
  var html = "<div id=\"" + (response.error ? channel : response.name) + "-row\" " +
      "class=\"row panel panel-default\">\n";
  html += "  <div class=\"col-sm-2 icon-area\">\n";
  if (response.logo)
    html += "    <img src=\"" + response.logo + "\" width=\"50\" />\n";
  html += "  </div>\n";
  html += "  <div class=\"col-sm-8\">\n";
  html += "    <div class=\"channel-info\">\n";
  if (!response.error)
    html += "      <div><strong><a href=\"" + response.url + "\">" +
      response.display_name + "</strong></a></div>\n";
  else
    html += "      <div class=\"red\"><strong>Channel '" + channel +
      "' does not exist!</strong></div>\n";
  if (response.status && !response.error)
    html += "      <div><small>" + response.status + "</small></div>\n";
  html += "      <div class=\"game\"></div>\n"; 
  html += "    </div>\n";
  html += "  </div>\n";
  html += "  <div class=\"col-sm-2 online-status\"></div>\n";
  html += "</div>\n\n";
  
  $("#channel-list").html($("#channel-list").html() + html); 
}

function insertChannelStatus(response, channel)
{
  if (response.stream)
  {
    $("#" + channel + "-row div.online-status").html("Online").addClass("green");
    $("#" + channel + "-row div.game").html("<small>Streaming \"" +
      response.stream.game + "\"</small>").addClass("green");
    $("#" + channel + "-row").addClass("online");
  }
  else
  {
    $("#" + channel + "-row div.online-status").html("Offline").addClass("red");
    $("#" + channel + "-row").addClass("offline");
  }
}

function updateStatusInfo(channel)
{
  $.ajax(
  {
    url: "https://api.twitch.tv/kraken/streams/" + channel,
    method: "GET",
    crossDomain: true,
    dataType: "jsonp",
    accepts:
    {
      twitch_json: "application/vnd.twitchtv.v3+json"
    },
    data:
    {
      client_id: clientId
    },
    success: function(response)
    {
      insertChannelStatus(response, channel);
    },
    error: function(data) 
    { 
      console.error(JSON.stringify(data)); 
    },
  });
}

function onMenuClick(itemName)
{
  $("li").removeClass("active");
  $(itemName).addClass("active");
  if (itemName === "#online-menu-item")
  {
//    $(".non-existent").fadeOut(500);
//    $(".offline").fadeOut(500, function() { $(".online").fadeIn(500); });
    $(".non-existent,.offline").fadeOut(500, function() { $(".online").fadeIn(500); });
  }
  else
  if (itemName === "#offline-menu-item")
  {
    $(".online,.non-existent").fadeOut(1000, function() { $(".offline").fadeIn(500); });
  }
  else
  if (itemName === "#all-menu-item")
  {
    $(".online,.offline, .non-existent").fadeIn(500);
  }
  else
  if (itemName === "#non-existent-menu-item")
  {
    $(".online,.offline").fadeOut(500, function() { $(".non-existent").fadeIn(1000); });
  }
}
  

