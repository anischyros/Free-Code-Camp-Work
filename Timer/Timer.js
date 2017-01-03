var millis = 1000;  // For debugging purposes; currently set at 1 second
var minutes;
var seconds;
var mode = "work";
var timer = undefined;
var started = false;

function beep()
{
//  $("#beep").get(0).play();
  $("<audio id='beep' preload='auto' autobuffer><source src='Beep.mp3' /><source src='Beep.wav' /></audio>").get(0).play();
}

function updateProgressLabel()
{
  $("#progress-label").text((mode === "work"? "Work" : "Break") + " " + 
    minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

function onTimerTick(ticks)
{
  if (seconds === 0)
  {
    minutes--;
    seconds = 59;
  }
  else
    seconds--;
  $("#progress-bar").progressbar("value",
    $("#progress-bar").progressbar("value") + 1);
  
  if (minutes === 0 & seconds === 0)
  {
    beep();
    
    if (mode === "work")
      mode = "break";
    else
      mode = "work";
    minutes = $("#" + mode + "-interval-slider").slider("value");
    seconds = 0;
    $("#progress-bar").progressbar(
    {
      value: 0,
      max: minutes * 60
    });
  }
  
  updateProgressLabel();
}

function onStartStopButton()
{
  if (!timer)
  {
    timer = new Timer(onTimerTick, millis);
    minutes = $("#work-interval-slider").slider("value");
    seconds = 0;
    $("#progress-bar").progressbar("option", "max", minutes * 60);
    updateProgressLabel();
  }
  
  if (!started)
  {
    timer.start();
    $("#start-stop-button").text("Pause");
    started = true;
  }
  else
  {
    timer.stop();
    $("#start-stop-button").text("Start");
    started = false;
  }
}

function onResetButton()
{
  if (timer)
    timer.stop();
  timer = new Timer(onTimerTick, millis);
  minutes = $("#work-interval-slider").slider("value");
  seconds = 0;
  mode = "work";
  started = false;
  updateProgressLabel();
  $("#progress-bar").progressbar("value", 0);
  $("#start-stop-button").text("Start");
}

// Timer code
var Timer = function(h, i)
{
  var interval = i;  // in milliseconds
  var handler = h;
  var ticks = 0;
  var timerId = undefined;
  
  var onTick = function()
  {
    timerId = setTimeout(onTick, interval);
    ticks++;
    handler(ticks, this);
  }
  
  this.getTicks = function() 
  { 
    return this.ticks; 
  };
  
  this.start = function() 
  { 
    timerId = setTimeout(onTick, interval); 
  };
  
  this.stop = function()
  {
    if (timerId != undefined)
      clearTimeout(timerId);
  };
  
  this.reset = function()
  {
    this.stop();
    ticks = 0;
    this.start();
  };
  
  this.getInterval = function() 
  {
    return interval; 
  };
  
  this.getTicks = function() 
  { 
    return ticks; 
  };
}

$("#work-interval-slider").slider(
{
  value: 25,
  min: 5,
  max: 60,
  step: 5,
  slide: function(event, ui)
  {
    $("#work-interval-period").val(ui.value);
  }
}).css("background", "red").css("border", "blue solid 1px");

$("#break-interval-slider").slider(
{
  value: 5,
  min: 5,
  max: 30,
  step: 5,
  slide: function(event, ui)
  {
    $("#break-interval-period").val(ui.value);
  }
}).css("background", "green").css("border", "blue solid 1px");

// This must be done after slider initialization.  Putting this in a CSS
// file does not work.
$(".ui-slider-handle").css("background", "blue");

$("#work-interval-period").val($("#work-interval-slider").slider("value"));
$("#break-interval-period").val($("#break-interval-slider").slider("value"));

$("#progress-bar").progressbar(
{
  value: 0
}).css("background", "yellow").css("border", "1px solid blue");

$(".ui-progressbar-value").css("background", "gray");

$("#start-stop-button").on("click", onStartStopButton);
$("#reset-button").on("click", onResetButton);
