var accum = 0;
var decimalPressed = false;
var pendingOp = undefined;
var okToClearDisplay = true;
var sign = true;
var opLastPressed = false;
var maxNbrOfDigits = Number($("#display-field").attr("maxlength"));

// Initialize calculator buttons
$("button").on("click", onButtonClick);
$("#display-field").on("keypress", onKeyPress);

function truncateZeros(s)
{
  if (s[s.length - 1] != "0")
    return s;
  
  var ndx = -1;
  for (var i = s.length - 1; i >= 0; i--)
  {
    if (s[i] != "0")
    {
      ndx = i;
      break;
    }
  }
  
  return s.substring(0, ndx + 1);
}

function updateDisplay()
{
  var field = $("#display-field");
  
  if (!isFinite(accum))
  {
    processClear();
    field.val("INFINITY");
    return;
  }
  
  var value = "" + accum;
  
  // Do we even need to think about rounding?
  if (accum < 0 && value.length <= maxNbrOfDigits + 1 ||
      accum >= 0 && value.length <= maxNbrOfDigits)
  {
    $("#display-field").val(accum);    
    return;
  }

  // It's too long to fit.  We need to think about rounding.
  var loc = value.indexOf(".");
  if (loc < 0)
  {
    // It has no decimal place
    if (accum < 0 && value.length > maxNbrOfDigits + 1 || 
        accum >= 0 && value.length > maxNbrOfDigits)
    {
      // And it's too big.  Maybe do some scientic notation here.
      processClear();
      field.val("TOO BIG");
    }
    return;
  }

  // There is a decimal point and it's too long to fit into the
  // display.  Compute precision and round.
  var precision = maxNbrOfDigits - loc;
  value = accum.toFixed(precision);
  
  // For some reason, the rounding process leaves trailing zeros.  Eliminate these
  value = truncateZeros(value);
  
  $("#display-field").val(value);  
}

function processClear()
{
  accum = 0;
  decimalPressed = false;
  pendingOp = undefined;
  okToClearDisplay = true;
  sign = true;
  $("#display-field").val("0");
}

function processDigit(digit)
{
  opLastPressed = false;
  
  var field = $("#display-field");
  
  var value = field.val();
  if (digit == 0 && value === "0")
    return;
  
  if (okToClearDisplay)
  {
    decimalPressed = false;
    sign = true;
    value = "0";
    okToClearDisplay = false;
  }
  
  if (value.length < maxNbrOfDigits)
  {
      if (value === "0")
        field.val((!sign && value[0] != "-" ? "-" : "") + digit);
      else
        field.val((!sign && value[0] != "-" ? "-" : "") + value + digit);
  }
}

function processDecimal()
{
  opLastPressed = false;
  
  var field = $("#display-field");
  var value;
  if (okToClearDisplay)
  {
    decimalPressed = false;
    sign = true;
    okToClearDisplay = false;
    value = "0";
  }
  else
    value = field.val();
  
  if (value.indexOf(".") < 0)
    field.val(value + ".");
}

function processChangeSign()
{
  var field = $("#display-field");
  sign = !sign;
  var value = field.val();
  if (Number(value) > 0)
    value = "-" + value;
  else
  if (Number(value) < 0)
    value = value.substring(1);
  field.val(value);
}

function completePendingOp()
{
  var value = Number($("#display-field").val());
  switch(pendingOp)
  {
    case "add":
      value = accum + value;
      break;
    case "subtract":
      value = accum - value;
      break;
    case "multiply":
      value = accum * value;
      break;
    case "divide":
      value = accum / value;
      break;
  }

  accum = value;
  pendingOp = undefined;
  okToClearDisplay = true;

  updateDisplay();
}

function processOperation(op)
{
  if (okToClearDisplay)
  {
    pendingOp = op;
    return;
  }

  if (pendingOp && !opLastPressed)
    completePendingOp();
  else
    accum = Number($("#display-field").val());
  pendingOp = op;
  okToClearDisplay = true;
  opLastPressed = true;
}

function processEquals()
{
  if (pendingOp)
  {
    completePendingOp();
    opLastPressed = false;
  }
}

// Adapted from a solution found at http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
function setCaretPos(field, pos)
{
  if (field.createTextRange) 
  {
    var range = field.createTextRange();
    console.log("range = " + range);
    range.move('character', pos);
    range.select();
  }
  else
  if (field.selectionStart)
  {
    console.log("Setting selection range");
    field.setSelectionRange(pos, pos);
  }
}

// Adapted and mostly borrowed from example at http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
function getCaretPos(oField) 
{
  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) 
  {
  // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }
  else 
  // Firefox support
  if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return iCaretPos;
}

function processDeleteKey()
{
  if (okToClearDisplay)
  {
    processClear();
    return;
  }
  
  var displayField = $("#display-field");
  var value = displayField.val();
  if (value === "0")
    return;
  
  var field = document.getElementById("display-field");
  var caretPos = getCaretPos(field);
  if (caretPos > 0)
  {
    if (caretPos == 1)
    {
      if (value.length > 1)
      {
        value = value.substring(1);
        caretPos = 0;
      }
      else
        value = "0";
    }
    else
    if (caretPos == value.length && value.length > 1)
      value = value.substring(0, caretPos - 1);
    else
    {
      value = value.substring(0, caretPos - 1) + value.substring(caretPos);
      caretPos--;
    }
  }
  displayField.val(value);
  setCaretPos(field, caretPos);
}

function onButtonClick(event)
{
  switch(event.target.id)
  {
    case "zero-button":
      processDigit(0); break;
    case "one-button":
      processDigit(1); break;
    case "two-button":
      processDigit(2); break;
    case "three-button":
      processDigit(3); break;
    case "four-button":
      processDigit(4); break;
    case "five-button":
      processDigit(5); break;
    case "six-button":
      processDigit(6); break;
    case "seven-button":
      processDigit(7); break;
    case "eight-button":
      processDigit(8); break;
    case "nine-button":
      processDigit(9); break;
    case "clear-button":
      processClear(); break;
    case "change-sign-button":
      processChangeSign(); break;
    case "divide-button":
      processOperation("divide"); break;
    case "multiply-button":
      processOperation("multiply"); break;
    case "plus-button":
      processOperation("add"); break;
    case "minus-button":
      processOperation("subtract"); break;
    case "equals-button":
      processEquals(); break;
    case "decimal-button":
      processDecimal(); break;
  }
}

function onKeyPress(event)
{
  var ch = String.fromCharCode(event.which);
  if (ch >= "0" && ch <= "9")
    processDigit(Number(ch));
  else
  if (ch === "C" || ch === "c")
      processClear();
  else
  if (ch === "/")
    processOperation("divide");
  else
  if (ch === "*" || ch === "X" || ch === "x")
    processOperation("multiply");
  else
  if (ch === "+")
    processOperation("add");
  else
  if (ch === "-")
    processOperation("subtract");
  else
  if (ch === "=" || event.which === 13)
    processEquals();
  else
  if (ch === ".")
    processDecimal();
  else
  if (event.which === 8)
    processDeleteKey();
}

