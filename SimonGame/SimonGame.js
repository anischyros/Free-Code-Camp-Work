var maxSequence = 20;
var mousePressed = undefined;
var mouseReleased = undefined;
var readyToBegin = 0;
var playSequence = 1;
var waitForSequence = 2;
var state = readyToBegin;
var sequence = [];
var pausePeriod = 1000;
var userCount = 1;
var clickCount = 0;
var sequenceNdx;
var strict = false;
var wrongButtonClicked = false;
var savedBackgroundColor = {};
var mp3Name = {};
mp3Name["red-area"] = "simonSound1.mp3";
mp3Name["blue-area"] = "simonSound2.mp3";
mp3Name["green-area"] = "simonSound3.mp3";
mp3Name["yellow-area"] = "simonSound4.mp3";
mp3Name["buzzer"] = "Buzzer.mp3";
mp3Name["tada"] = "Tada.mp3";
var animations = ["rubberBand", "bounce", "shake", "wobble"];

function buildNewColorSequence()
{
  sequence = [];
  // Choose color sequence
  for (var i = 0; i < maxSequence; i++)
    sequence.push(chooseColorAreaId(Math.floor(Math.random() * 4)));
}

function darken(id)
{
  var lum = -0.5;
  savedBackgroundColor[id] = $("#" + id).css("background-color");
  var digits = 
    /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(savedBackgroundColor[id]);
  var rgb = [];
  for (var i = 2; i <= 4; i++)
  {
    var c = parseInt(digits[i]);
    rgb.push(Math.round(Math.min(Math.max(0, c + c * lum)), 255));
  }
  $("#" + id).css("background-color", "rgb(" + rgb[0] + "," + rgb[1] + 
    "," + rgb[2] + ")");
}

function restore(id)
{
  $("#" + id).css("background-color", savedBackgroundColor[id]);
}

function buzzer()
{
  play("buzzer");
  var animationNdx = Math.floor(Math.random() * animations.length);
  $("#brain-area").addClass("animated " + animations[animationNdx]);
  var s = "animated";
  animations.forEach(function(method) { s += " " + method });
  setTimeout(function() { $("#brain-area").removeClass(s) }, 2000);
}

function tada()
{
  play("tada");
  $("#brain-area").addClass("animated flash");
  setTimeout(function() { $("#brain-area").removeClass("animated flash") }, 2000);
}

function play(id)
{
  $("<audio src='" + mp3Name[id] + "' />")[0].play();
}

function onMouseDown(event)
{
  mousePressed = event.target.id;
  processState();
}

function onMouseUp(event)
{
  if (!mousePressed)
    return;
  
  mouseReleased = event.target.id;
  processState();
}

function resetGame()
{
  state = readyToBegin;
  $("#start-area button").button("enable");
  buildNewColorSequence();
  sequenceNdx = 0;
  pausePeriod = 1000;
  userCount = 0;
}

function processState()
{
  // Game initialization
  if (state === readyToBegin)
  {
    // Catch situation where use is pushing buttons he shouldn't be pushing
    if (mousePressed || mouseReleased)
    {
      mousePressed = undefined;
      mouseReleased = undefined;
      return;
    }
    
    // Disable start button
    $("#start-area button").button("disable");
    
    // Start with the first color in the selected sequence
    sequenceNdx = 0;
  
    // Change state to "play sequence"
    state = playSequence;
    
    // Update the user's color count
    userCount = 0;
    
    // Reset pausePeriod to its initial value.
    pausePeriod = 1000;
    
    // Process the state again after a second.
    setTimeout(function() { processState(); }, 1000);
    
    return;
  }
  
  // Play sequence of colors and sounds, with a "pausePeriod" milliseconds interval
  // between each one after that.  When sequence has been finished, change state 
  // to "waitForSequence".
  if (state === playSequence)
  {
    // Catch situation where use is pushing buttons he shouldn't be pushing
    if (mousePressed || mouseReleased)
    {
      mousePressed = undefined;
      mouseReleased = undefined;
      return;
    }
    
    // Playing of sequence finished?
    if (sequenceNdx > userCount)
//    if (sequenceNdx > maxSequence) // testing
    {
      state = waitForSequence;
      clickCount = 0;
      return;
    }

    // Display count field
    $("#count-field").text(userCount + 1);
    
    // Play one part of sequence
    darken(sequence[sequenceNdx]);
    play(sequence[sequenceNdx]);
    sequenceNdx++;
    
    // Wait "pausePeriod" millis, restore button color, and then wait another
    // "pausePeriod" millis before processing the state again
    setTimeout(function() 
    {
      restore(sequence[sequenceNdx - 1]);
      setTimeout(function() { processState(); }, pausePeriod);
    }, pausePeriod);
  }
  
  if (state === waitForSequence)
  {
    // Mouse pressed?
    if (mousePressed && !mouseReleased)
    {
      // Light up color button
      darken(mousePressed);
      
      // Color button was pressed?
      if (mousePressed === sequence[clickCount])
      {
        // Play color button sound
        play(mousePressed);
        clickCount++;
        return;
      }

      // Color button pushed out of sequence.  Play buzzer
      buzzer();
      
      // Indicate wrong button was clicked
      wrongButtonClicked = true;
    }
    
    // Mouse released (or pointer dragged out of the color button)?
    if (mouseReleased)
    {
      restore(mousePressed);
      mousePressed = undefined;
      mouseReleased = undefined;
      
      if (wrongButtonClicked)
      {
        wrongButtonClicked = false;
        if (strict)
        {
          resetGame();
        }
        else
        {  
          sequenceNdx = 0;
          clickCount = 0;
        }
        state = playSequence;

        // Update count in display and process current state
        setTimeout(function() { processState(); }, 3000);
        return;
      }
      
      if (clickCount >= sequence.length)
      {
        tada();
        resetGame();
        return;
        
      }
        
      // If at the end of the sequence, change the state so that it will be played
      // again but with the next sequence added.
      if (clickCount > userCount)
      {
        wrongButtonClicked = false;
        state = playSequence;
        sequenceNdx = 0;
        clickCount = 0;
        userCount++;

        // Update count in display and process current state
        setTimeout(function() 
        {
          processState(); 
        }, 3000);
        return;
      }
    }
  }
}

function chooseColorAreaId(n)
{
    if (n === 0)
      return "red-area";
    if (n === 1)
      return "blue-area";
    if (n === 2)
      return "green-area";
   return "yellow-area";
}

function startGame()
{
  if (state != readyToBegin)
    return;

  processState();
}

$(".color-button")
  .on("mousedown", onMouseDown)
  .on("mouseup mouseleave", onMouseUp);

$("#reset-area button")
  .button()
  .on("click", resetGame);

$("#start-area button")
  .button()
  .on("click", startGame);

$("#strict-slider").slider(
{
  value: 0,
  min: 0,
  max: 100,
  step: 100,
  slide: function(event, ui) { strict = (ui.value === 100); }
});

buildNewColorSequence();
