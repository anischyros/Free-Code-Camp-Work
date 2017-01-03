var rightArrowIconURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/right-arrow.svg";
var downArrowIconURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/down-arrow.svg";
var disabledRightArrowIcon = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/right-arrow-disabled.svg";
var searchResults;

function updateExtractPanel(pageId)
{
  // Get page for the specified pageid
  var page = searchResults.query.pages[pageId];

  // If a thumbnail is available, built HTML that will display that image along with the extract;
  // otherwise, just use the extract.
  var html;
  if (page.thumbnail)
  {
    html = "<table><tr>";
    html += "<td><p class=\"text-justify\">" + page.extract + "</p></td>";
    html += "<td class=\"padded-thumbnail text-right\"><img src=\"" + page.thumbnail.source + "\" width=\"" + page.thumbnail.width + "\" height=\"" +
      page.thumbnail.height + "\" /></td>";
    html += "</tr></table>";
  }
  else
    html = "<p>" + page.extract + "</p>";
  
  // Insert HTML into DOM
  $("#panel-" + pageId).html(html);
}

function onArrowClick(pageId)
{
  // If for some reason the searchResults have disappeared, stop there.
  if (!searchResults)
    return;
  
  // If extract panel is visible, display a right arrow on the left; otherwise, display a down arrow.
  if ($("#panel-" + pageId).css("display") != "none")
  {
    $("#img-" + pageId).attr("src", rightArrowIconURL)
      .attr("title", "Click here to show description");
  }
  else
  {
    updateExtractPanel(pageId);
    $("#img-" + pageId).attr("src", downArrowIconURL)
      .attr("title", "Click here to hide description");
  }

  // Fade the extract panel in or out.
  $("#panel-" + pageId).fadeToggle(700);
}

function getArrowIcon(pageId)
{
  var start = "<a href=\"javascript:onArrowClick(" + pageId + ")\">";
  var img = "<img id=\"img-" + pageId + "\" src=\"" + rightArrowIconURL + 
      "\" width=\"13\" title=\"Click here to show description\" style=\"margin-right: 10px\" />";
  var end = "</a>";
  return start + img + end;
}

function getDisabledArrowIcon()
{
  return "<img src=\"" + disabledRightArrowIcon + "\" width=\"13\" style=\"margin-right: 10px\" />";
}

function queryWikipedia(searchTerm)
{
  $.ajax(
  {
    url: "https://en.wikipedia.org/w/api.php",
    method: "GET",
    dataType: "jsonp",
    data:
    {
      action: "query",
      format: "json",
      generator: "search",
      gsrnamespace: 0,
      gsrlimit: 50,
      prop: "pageimages|extracts",
      pilimit: "max",
      exintro: true,
      explaintext: true,
      exsentences: 1,
      exlimit: "max",
      gsrsearch: searchTerm
    },
    success: processJsonResponse,
    error: onError
  });
}

function processJsonResponse(response)
{
  var searchTerm = $("form input").val().trim();
  if (!response.query)
  {
    $("#message-area").html("<h3 class=\"error-text\">Search term <em>\"" + 
      searchTerm + "\"</em> was not found</h3>");
    searchResults = undefined;
    return;  
  }
  
  $("#message-area").html("<div class=\"well well-sm\">" +
    "<span class=\"search-term-display\"><u>" +
    "Showing results of search for term <em>\"" + searchTerm + 
    "\"</em></u></span></div>");
    searchResults = response;
  
  var html = "";
  Object.keys(response.query.pages).forEach(function(pageId)
  {
    var page = response.query.pages[pageId];
    
    var header;
    var desc;
    if (page.title && page.title.trim().length > 0)
    {
      header = page.title.trim();
      if (page.extract && page.extract.trim().length > 0)
        desc = page.extract.trim();
    }
    else
    if (page.extract && page.extract.trim().length > 0)
      header = page.extract.trim();
    
    if (header)
    {
      var url = "https://en.wikipedia.org/?curid=" + pageId;
      
      html += "<div class=\"panel panel-default\">";
      var icon = (desc ? getArrowIcon(pageId) : getDisabledArrowIcon());
      html += "<div class=\"panel-heading\">" + icon + "<a href=\"" + url + 
        "\" target=\"_blank\">" + header + "</a></div>";
      if (desc)
        html += "<div id=\"panel-" + pageId + "\" class=\"panel-body\" " +
          "style=\"display: none\"><p></p></div>";
      
      html += "</div>";
    }
  });
  
  $("#wikipedia-api-response").html(html);

  // Clear the form input field and give it the focus.
  $("form input").val("")
    .focus();

  // Fade in the new response
  $("#wikipedia-api-response").fadeIn();
}

function onError(info, b)
{
  console.log("Error: " + JSON.stringify(info));
  window.alert("An error occurred:  " + JSON.stringify(info));
}

function onFormSubmit()
{
  var searchTerm = $("form input").val();
  if (!searchTerm || searchTerm.trim().length == 0)
    return;
  
  queryWikipedia(searchTerm.trim());
  $("#wikipedia-api-response").fadeOut();
}

function onRandomArticleButton()
{
  window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank');
}

