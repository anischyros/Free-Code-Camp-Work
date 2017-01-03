var playerChar = "X";
var board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];

function beep()
{
  $("<audio id='beep' preload='auto' autobuffer><source src='Beep.mp3' /><source src='Beep.wav' /></audio>")
    .get(0)
    .play();
}

function rowInDanger(row)
{
  var cCount = 0;
  var pCount = 0;
  for (var col = 0; col < 3; col++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
  }
  return (pCount === 2 && cCount === 0);
}

function colInDanger(col)
{
  var cCount = 0;
  var pCount = 0;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
  }
  return (pCount === 2 && cCount === 0);
}

function leftDiagonalInDanger()
{
  var cCount = 0;
  var pCount = 0;
  for (var i = 0; i < 3; i++)
  {
    if (board[i][i] === 0)
      pCount++;
    else
    if (board[i][i] === 1)
      cCount++;
  }
  return (pCount === 2 && cCount === 0);
}

function rightDiagonalInDanger()
{
  var cCount = 0;
  var pCount = 0;
  
  var col = 2;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
    col--;
  }
  return (pCount === 2 && cCount === 0);
}

function fillSquare(row, col)
{
  board[row][col] = 1;
  $("#square-" + (row + 1) + "-" + (col + 1) + " div")
    .text(playerChar === "X" ? "O" : "X")
    .addClass("animated bounceIn");
}

function fillRowInDanger(row)
{
  for (var col = 0; col < 3; col++)
  {
    if (board[row][col] === -1)
    {
      board[row][col] = 1;
      fillSquare(row, col);
      break;
    }
  }
}

function fillColInDanger(col)
{
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === -1)
    {
      fillSquare(row, col);
      break;
    }
  }
}

function fillLeftDiagonalInDanger()
{
  for (var i = 0; i < 3; i++)
  {
    if (board[i][i] === -1)
    {
      fillSquare(i, i);
      break;
    }
  }
}

function fillRightDiagonalInDanger()
{
  var col = 2;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === -1)
    {
      fillSquare(row, col);
      break;
    }
    col--;
  }
}

function dangerDetected()
{
  for (var i = 0; i < 3; i++)
  {
    if (rowInDanger(i))
    {
      fillRowInDanger(i);
      return true;
    }
    if (colInDanger(i))
    {
      fillColInDanger(i);
      return true;
    }
  }
  if (leftDiagonalInDanger())
  {
    fillLeftDiagonalInDanger();
    return true;
  }
  if (rightDiagonalInDanger())
  {
    fillRightDiagonalInDanger();  
    return true;
  }
  
  return false;
}

function fillRandomSquare()
{
  var list = [];
  for (var row = 0; row < 3; row++)
    for (var col = 0; col < 3; col++)
      if (board[row][col] === -1)
        list.push({ "row": row, "col": col });
  
  if (list.length > 0)
  {
    var entry = list[Math.floor(Math.random() * list.length)];
    fillSquare(entry.row, entry.col);
  }
}

function winningRow(row)
{
  var cCount = 0;
  var pCount = 0;
  for (var col = 0; col < 3; col++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
  }
  return (cCount === 2 && pCount === 0);
}

function winningCol(col)
{
  var cCount = 0;
  var pCount = 0;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
  }
  return (cCount === 2 && pCount === 0);
}

function winningLeftDiagonal()
{
  var cCount = 0;
  var pCount = 0;
  for (var i = 0; i < 3; i++)
  {
    if (board[i][i] === 0)
      pCount++;
    else
    if (board[i][i] === 1)
      cCount++;
  }
  return (cCount === 2 && pCount === 0);
}

function winningRightDiagonal()
{
  var cCount = 0;
  var pCount = 0;
  var col = 2;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 0)
      pCount++;
    else
    if (board[row][col] === 1)
      cCount++;
    col--;
  }
  return (cCount === 2 && pCount === 0);
}

function completeRow(row)
{
  for (var col = 0; col < 3; col++)
    if (board[row][col] === -1)
    {
      fillSquare(row, col);
      return;
    }
}

function completeCol(col)
{
  for (var row = 0; row < 3; row++)
    if (board[row][col] === -1)
    {
      fillSquare(row, col);
      return;
    }
}

function completeLeftDiagonal()
{
  for (var i = 0; i < 3; i++)
    if (board[i][i] === -1)
    {
      fillSquare(i, i);
      return;
    }
}

function completeRightDiagonal()
{
  var col = 2;
  for (var row = 0; row < 2; row++)
  {
    if (board[row][col] === -1)
    {
      fillSquare(row, col);
      return;
    }
    col--;
  }
}

function canComputerWin()
{
  for (var i = 0; i < 3; i++)
  {
    if (winningRow(i))
    {
      completeRow(i);
      return true;
    }
    if (winningCol(i))
    {
      completeCol(i);
      return true;
    }
  }
  if (winningLeftDiagonal())
  {
    completeLeftDiagonal()
    return true;
  }
  if (winningRightDiagonal())
  {
    completeRightDiagonal();
    return true;
  }
  
  return false;
}

function rowFilled(row)
{
  var n = board[row][0];
  if (n !== -1 && board[row][1] === n && board[row][2] === n)
    return n;
  return -1;
}

function colFilled(col)
{
  var n = board[0][col];
  if (n !== -1 && board[1][col] === n && board[2][col] === n)
    return n;
  return -1;
}

function leftDiagonalFilled()
{
  var n = board[0][0];
  if (n !== -1 && board[1][1] === n && board[2][2] === n)
    return n;
  return -1;
}

function rightDiagonalFilled()
{
  var n = board[0][2];
  if (n !== -1 && board[1][1] === n && board[2][0] === n)
    return n;
  return -1;
}

function gameTied()
{
  for (var row = 0; row < 3; row++)
    for (var col = 0; col < 3; col++)
      if (board[row][col] === -1)
        return false;
  return true;
}

function resetGame()
{
  board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
  for (var row = 1; row <= 3; row++)
    for (var col = 1; col <= 3; col++)
      $("#square-" + row + "-" + col + " div")
        .text("")
        .removeClass("animated bounceIn");
}

function announceGameResults(msg)
{
  beep();
  $("<div><p>" + msg + "</p>").dialog(
  {
    modal: true,
    show: true,
    hide: true,
    closeOnEscape: false,
    buttons:
    {
      Ok: function() 
      {
        $(this)
          .dialog("close")
          .dialog("destroy")
          .hide();
        resetGame();
      }
    }
  });
}

function isGameOver()
{
  for (var i = 0; i < 3; i++)
  {
    var n = rowFilled(i);
    if (n !== -1)
    {
      announceGameResults("Game over.  " + 
        (n === 0 ? "You have" : "Computer has") + " won.");
      return true;
    }
    n = colFilled(i);
    if (n !== -1)
    {
      announceGameResults("Game over.  " + 
        (n === 0 ? "You have" : "Computer has") + " won.");
      return true;
    }
  }
  n = leftDiagonalFilled();
  if (n !== -1)
  {
    announceGameResults("Game over.  " + 
      (n === 0 ? "You have" : "Computer has") + " won.");
    return true;
  }
  n = rightDiagonalFilled();
  if (n !== -1)
  {
    announceGameResults("Game over.  " + 
      (n === 0 ? "You have" : "Computer has") + " won.");
    return true;
  }
    
  if (gameTied())
  {
    announceGameResults("Game is a draw.");
    return true;
  }
  
  return false;
}

function rowAvailable(row)
{
  var count = 0;
  for (var col = 0; col < 3; col++)
  {
    if (board[row][col] === 1)
      count++;
    if (board[row][col] === 0)
      return false;
  }
  return (count === 1);
}

function colAvailable(col)
{
  var count = 0;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 1)
      count++;
    if (board[row][col] === 0)
      return false;
  }
  return (count === 1);
}

function leftDiagonalAvailable()
{
  var count = 0;
  for (var i = 0; i < 3; i++)
  {
    if (board[i][i] === 1)
      count++;
    if (board[i][i] === 0)
      return false;
  }
  return (count === 1);
}

function rightDiagonalAvailable()
{
  var count = 0;
  var col = 2;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === 1)
      count++;
    if (board[row][col] === 0)
      return false;
    col--;
  }
  return (count === 1);
}

function fillRow(row)
{
  var list = [];
  for (var col = 0; col < 3; col++)
    if (board[row][col] === -1)
      list.push(col);
  fillSquare(row, list[Math.floor(Math.random() + 0.5)]);
}

function fillCol(col)
{
  var list = [];
  for (var row = 0; row < 3; row++)
    if (board[row][col] === -1)
      list.push(row);
  fillSquare(list[Math.floor(Math.random() + 0.5)], col);
}

function fillLeftDiagonal()
{
  var list = [];
  for (var i = 0; i < 3; i++)
    if (board[i][i] === -1)
      list.push(i);
  i = list[Math.floor(Math.random() + 0.5)];
  fillSquare(i, i);
}

function fillRightDiagonal()
{
  var list = [];
  var col = 2;
  for (var row = 0; row < 3; row++)
  {
    if (board[row][col] === -1)
      list.push({ "row": row, "col": col });
    col--;
  }
  var obj = list[Math.floor(Math.random() + 0.5)];
  fillSquare(obj.row, obj.col);
}

function findAvailableVector()
{
  for (i = 0; i < 3; i++)
  {
    if (rowAvailable(i))
    {
      fillRow(i);
      return true;
    }
    if (colAvailable(i))
    {
      fillCol(i);
      return true;
    }
  }
  if (leftDiagonalAvailable())
  {
    fillLeftDiagonal();
    return true;
  }
  if (rightDiagonalAvailable())
  {
    fillRightDiagonal();
    return true;
  }
  
  return false;
}

function squareClicked(event)
{
  var a = event.target.id.split("-");
  var x = Number(a[1]);
  var y = Number(a[2]);
  
  $("#square-" + x + "-" + y + " div").text(playerChar);
  board[x - 1][y - 1] = 0;
  
  if (!isGameOver())
  {
    if (!canComputerWin() && !dangerDetected())
    {
      if (!isGameOver())
      {
        if (!findAvailableVector())
          fillRandomSquare();
      }
    }
    else
      isGameOver();
  }
}

$(".square").on("click", squareClicked);

beep();
$("<div><p>Do you want to be X or O?</p></div>").dialog(
{
  modal: true,
  show: true,
  hide: true,
  closeOnEscape: false,
  buttons:
  {
    X: function() 
    {
      playerChar = "X";
      $(this)
        .dialog("close")
        .dialog("destroy")
        .hide();
    },
    O: function() 
    {
      playerChar = "O";
      $(this)
        .dialog("close")
        .dialog("destroy")
        .hide();
    }
  }
});
