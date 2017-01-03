$(function() 
{
  $("#skills-and-interests-accordion").accordion( 
  { 
    collapsible: true, 
    active: false,
    icons:
    {
      header: "ui-icon-triangle-1-e", activeHeader: "ui-icon-triangle-1-s"
    }
  });
});

function scrollToMarker(markerId)
{
  var divPosition = $("#" + markerId).offset();
  $('html, body').animate(
  {
    scrollTop: divPosition.top
  },
  "slow");
}
