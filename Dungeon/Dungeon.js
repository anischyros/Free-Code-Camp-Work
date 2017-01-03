// Declarations
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var UP_ARROW = 38;
var DOWN_ARROW = 40;

var DUNGEON_WIDTH = 75;
var DUNGEON_HEIGHT = 100;

var NORTH = 0;
var SOUTH = 1;
var EAST = 2;
var WEST = 3;

var WALL = 0
var EMPTY = 1;
var PLAYER = 2;
var FOOD = 3;
var WEAPON = 4;
var MONSTER = 5;
var BOSS = 6;

var initialBossHealth = 50;
var initialBossStrength = 30;
var nbrMonsters = 15;
var monsterHealth = []
var monsterStrength = [];
var foodValue = 
  [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
var weaponName = ["Stick", "Sharpened stick", "Filleting knife", "Steak knife", "Cleaver", "Long dagger", "Ginsu knife", "Chain saw", "Flame thrower", "Excalibur"];
var weaponValue = [2, 3, 5, 7, 9, 10, 11, 15, 18, 20];
var initialPlayerHealth = 10;
var bossCells = [];

// Functions
function determineStyleParams(cell, dark)
{
  var obj = {};
  
  if (dark)
  {
    var cellX = cell.col;
    var cellY = cell.row;
    var hyp = Math.sqrt((playerCol - cellX) * (playerCol - cellX) +
      (playerRow - cellY) * (playerRow - cellY));
    if (hyp > 10)
    {
      obj.background = "black";
      return obj;
    }
  }  
  
  switch (cell.type)
  {
    case WALL: obj.background = "gray"; break;
    case EMPTY: obj.background = "white"; break;
    case PLAYER: obj.background = "blue"; break;
    case FOOD: obj.background = "green"; break;
    case WEAPON: obj.background = "gold"; break;
    case MONSTER: obj.background = "red"; break;
    case BOSS: obj.background = "#882667"; break;
  }
  return obj;
}

function handleFood(cell, player)
{
  player.health += cell.health;
  PlayerStateComponent.setState({ health: player.health});
  cell.type = EMPTY;
  return false;
}

function handleWeapon(cell, player)
{
  var weapon = weaponName[nextWeapon];
  var damage = weaponValue[nextWeapon++];
  player.weaponDamage = damage;
  PlayerStateComponent.setState({ weaponDamage: damage, weapon: weapon});
  cell.type = EMPTY;
  return false;
}

function handleMonster(monster, player)
{
  var playerStrike = Math.floor(Math.random() * player.weaponDamage + player.level + 0.5);
  var monsterStrike = Math.floor(Math.random() * monster.strength + 0.5);
  player.health -= monsterStrike;
  monster.health -= playerStrike;
  PlayerStateComponent.setState({ health: player.health });

  if (player.health <= 0)
  {
    $("<div><p>I'm afraid that you are now quite dead!</p></div>").dialog({ modal: true});
    playerDead = true;
    player.type = EMPTY;
    ViewPortComponent.setState({ dungeon: dungeon });
    return true;
  }
  
  if (monster.health <= 0)
  {
    monster.type = EMPTY;
    player.experience += monster.strength;
    player.level = Math.floor(player.experience / 13);
    PlayerStateComponent.setState({ experience: player.experience, level: player.level });
    return false;
  }
  
  return true;
}

function handleBoss(boss, player)
{
  var playerStrike = Math.floor(Math.random() * player.weaponDamage + player.level + 0.5);
  var bossStrike = Math.floor(Math.random() * boss.strength + 0.5);
  player.health -= bossStrike;
  for (var i = 0; i < bossCells.length; i++)
    bossCells[i].health -= playerStrike;
  PlayerStateComponent.setState({ health: player.health });
  
  if (player.health <= 0)
  {
    $("<div><p>I'm afraid that you are now quite dead!</p></div>").dialog({ modal: true});
    playerDead = true;
    player.type = EMPTY;
    ViewPortComponent.setState({ dungeon: dungeon });
    return true;
  }

  if (boss.health <= 0)
  {
   $("<div><p>Hooray!  You've killed the boss!</p></div>").dialog({ modal: true});
    playerDead = true;
    for (var i = 0; i < bossCells.length; i++)
      bossCells[i].type = EMPTY;
    return false;
  }
  
  return true;
}

function handleOccupiedCell(row, col)
{
  var cell = dungeon[row][col];
  var player = dungeon[playerRow][playerCol];  
  
  if (cell.type === FOOD)
    return handleFood(cell, player);
  if (cell.type === WEAPON)
    return handleWeapon(cell, player);
  if (cell.type === MONSTER)
    return handleMonster(cell, player);
  if (cell.type === BOSS)
    return handleBoss(cell, player);

  return true;
}

function swapCells(row1, col1, row2, col2)
{
  var temp = dungeon[row1][col1];
  dungeon[row1][col1] = dungeon[row2][col2];
  dungeon[row2][col2] = temp;
  dungeon[row1][col1].row = row2;
  dungeon[row1][col1].col = col2;
  dungeon[row2][col2].row = row1;
  dungeon[row2][col2].col = col1;
}

function dump(msg, row, col)
{
  console.log(msg + ":");
  console.log("row = " + row + ", col = " + col);
  for (var y = row - 3; y <= row + 3; y++)
  {
    if (y < 0 || y >= dungeon.length)
      continue;
    
    var s = "" + y + ": ";
    for (var x = col - 3; x <= col + 3; x++)
    {
      if (x < 0 || x >= dungeon[0].length)
        continue;

      var code;
      switch(dungeon[y][x].type)
      {
        case WALL: code = "W"; break;
        case EMPTY: code = "-"; break;
        case PLAYER: code = "P"; break;
        case FOOD: code = "F"; break;
        case WEAPON: code = "W"; break;
        case MONSTER: code = "M"; break;
        case BOSS: code = "B"; break;
      }
      s += code;
    }
    console.log(s);
  }
}

function goNorth()
{
  if (playerDead || playerRow - 1 < 0)
    return;
  if (dungeon[playerRow - 1][playerCol].type != EMPTY) 
    if (handleOccupiedCell(playerRow - 1, playerCol))
      return;

  swapCells(playerRow, playerCol, playerRow - 1, playerCol);
  
  playerRow--;
  ViewPortComponent.setState({centerX: playerCol, centerY: playerRow,
    dungeon: dungeon});
}

function goSouth()
{
  if (playerDead || playerRow + 1 >= dungeon.length)
    return;
  if (dungeon[playerRow + 1][playerCol].type != EMPTY)
    if (handleOccupiedCell(playerRow + 1, playerCol))
      return;
  
  swapCells(playerRow, playerCol, playerRow + 1, playerCol);
  
  playerRow++;
  ViewPortComponent.setState({centerX: playerCol, centerY: playerRow,
    dungeon: dungeon});
}

function goEast()
{
  if (playerDead || playerCol + 1 >= dungeon[0].length)
    return;
  if (dungeon[playerRow][playerCol + 1].type != EMPTY)
    if (handleOccupiedCell(playerRow, playerCol + 1))
      return;
  
  swapCells(playerRow, playerCol, playerRow, playerCol + 1);
  
  playerCol++;
  ViewPortComponent.setState({centerX: playerCol, centerY: playerRow,
    dungeon: dungeon});
}

function goWest()
{
  if (playerDead || playerCol - 1 < 0)
    return;
  if (dungeon[playerRow][playerCol - 1].type != EMPTY)
    if (handleOccupiedCell(playerRow, playerCol - 1))
      return;
  
  swapCells(playerRow, playerCol, playerRow, playerCol - 1);
  
  playerCol--;
  ViewPortComponent.setState({centerX: playerCol, centerY: playerRow,
    dungeon: dungeon});
}

function onKeyDown(event)
{
  switch (event.which)
  {
    case LEFT_ARROW:
      goWest();
      break;
    case RIGHT_ARROW:
      goEast();
      break;
    case UP_ARROW:
      goNorth();
      break;
    case DOWN_ARROW:
      goSouth();
      break;
  }
  
  return false;   // prevent browser from handling key press
}

// Game setup code
var playerRow, playerCol;
var nextWeapon = 0;
var playerDead = false;

var Room = function(x, y, width, height)
{
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

// Code
var roomsList = [];
roomsList.push(new Room(0, 0, 10, 15));
roomsList.push(new Room(11, 5, 20, 25));
roomsList.push(new Room(32, 15, 10, 20));
roomsList.push(new Room(32, 2, 20, 12));
roomsList.push(new Room(54, 0, 20, 30));
roomsList.push(new Room(53, 0, 22, 30));
roomsList.push(new Room(43, 15, 10, 10));
roomsList.push(new Room(0, 31, 31, 20));
roomsList.push(new Room(32, 36, 31, 20));
roomsList.push(new Room(64, 31, 8, 60));
roomsList.push(new Room(0, 52, 25, 30));
roomsList.push(new Room(26, 58, 25, 30));
roomsList.push(new Room(5, 89, 60, 10));
roomsList.push(new Room(10, 10, 1, 1));
roomsList.push(new Room(25, 20, 20, 1));
roomsList.push(new Room(50, 10, 10, 1));
roomsList.push(new Room(64, 30, 1, 10));
roomsList.push(new Room(63, 38, 5, 1));
roomsList.push(new Room(50, 88, 1, 1));
roomsList.push(new Room(25, 80, 1, 1));
roomsList.push(new Room(10, 45, 1, 10));

// Initialize map
var dungeon = [];
for (var y = 0; y < DUNGEON_HEIGHT; y++)
{
  var row = [];
  for (var x = 0; x < DUNGEON_WIDTH; x++)
    row.push({ type: WALL, row: y, col: x });
  dungeon.push(row);
}

// Put rooms into dungeon
roomsList.forEach(function(room)
{
  for (var y = room.y; y < room.y + room.height; y++)
    for (var x = room.x; x < room.x + room.width; x++)
      dungeon[y][x] = { type: EMPTY, row: y, col: x };
});

// Build list of EMPTY spaces
var emptySpaces = [];
for (var row = 0; row < dungeon.length; row++)
  for (var col = 0; col < dungeon[0].length; col++)
    if (dungeon[row][col].type === EMPTY)
      emptySpaces.push({ row: row, col: col });

// Allocate monsters
for (var i = 0; i < nbrMonsters; i++)
{
  monsterHealth.push(Math.floor(Math.random() * 20 + 0.5) + 1);
  monsterStrength.push(Math.floor(Math.random() * 8 + 0.5) + 1);
}
for (var i = 0; i < monsterHealth.length; i++)
{
  var ndx = Math.floor(Math.random() * emptySpaces.length);
  var loc = emptySpaces[ndx];
  emptySpaces.splice(ndx, 1);
  dungeon[loc.row][loc.col] = { type: MONSTER, health: monsterHealth[i], 
    strength: monsterStrength[i], row: loc.row, col: loc.col };
}

// Allocate food
for (var i = 0; i < foodValue.length; i++)
{
  var ndx = Math.floor(Math.random() * emptySpaces.length);
  var loc = emptySpaces[ndx];
  emptySpaces.splice(ndx, 1);
  dungeon[loc.row][loc.col] = 
    { type: FOOD, health: foodValue[i], row: loc.row, col: loc.col };  
}

// Allocate weapons
for (var i = 0; i < weaponValue.length; i++)
{
  var ndx = Math.floor(Math.random() * emptySpaces.length);
  var loc = emptySpaces[ndx];
  emptySpaces.splice(ndx, 1);
  dungeon[loc.row][loc.col] = 
    { type: WEAPON, health: weaponValue[i], row: loc.row, col: loc.col };  
}

// Place the player
var ndx = Math.floor(Math.random() * emptySpaces.length);
var loc = emptySpaces[ndx];
emptySpaces.splice(ndx, 1);
playerRow = loc.row;
playerCol = loc.col;
dungeon[loc.row][loc.col] = 
  { type: PLAYER, health: initialPlayerHealth, experience: 0, 
   weapon: "Fists", weaponDamage: 1, level: 0, row: loc.row, col: loc.col };

// Place the boss
for (;;)
{
  var ndx = Math.floor(Math.random() * emptySpaces.length)
  var loc = emptySpaces[ndx];
  if (loc.row === 0 || loc.row === dungeon.length - 1 || 
      loc.col === 0 || loc.col === dungeon[0].length - 1)
    continue;
  
  if (dungeon[loc.row][loc.col + 1].type !== EMPTY ||
      dungeon[loc.row + 1][loc.col].type !== EMPTY || 
      dungeon[loc.row + 1][loc.col + 1].type !== EMPTY)
    continue;
  
  dungeon[loc.row][loc.col] = { type: BOSS, health: initialBossHealth, 
    strength: initialBossStrength, row: loc.row, col: loc.col };
  dungeon[loc.row][loc.col + 1] = { type: BOSS, health: initialBossHealth, 
    strength: initialBossStrength, row: loc.row, col: loc.col + 1 };
  dungeon[loc.row + 1][loc.col] = { type: BOSS, health: initialBossHealth, 
    strength: initialBossStrength, row: loc.row + 1, col: loc.col };
  dungeon[loc.row + 1][loc.col + 1] = { type: BOSS, health: initialBossHealth, 
    strength: initialBossStrength, row: loc.row + 1, col: loc.col + 1 };
  
  bossCells.push(dungeon[loc.row][loc.col]);
  bossCells.push(dungeon[loc.row][loc.col + 1]);
  bossCells.push(dungeon[loc.row + 1][loc.col]);
  bossCells.push(dungeon[loc.row + 1][loc.col + 1]);
  
  break;
}

var ViewPort = React.createClass(
{
  getDefaultProps: function()
  {
    return { width: 50, height: 50, initialOffsetX: 0, initialOffsetY: 0, 
      initialCenterX: 0, initialCenterY: 0 , initialDungeon: dungeon,
      initialDark: true };
  },
  getInitialState: function()
  {
    return { dungeon: this.props.initialDungeon, offsetX: this.props.initialOffsetX, 
      offsetY: this.props.initialOffsetY, centerX: this.props.initialCenterX, 
      centerY: this.props.initialCenterY, dark: this.props.initialDark };
  },
  render: function()
  {
    var centerX = this.state.centerX;
    var centerY = this.state.centerY;
    if (centerX - this.props.width / 2 < 0)
      centerX = this.props.width / 2;
    else
    if (centerX + this.props.width / 2 >= dungeon[0].length)
      centerX = dungeon[0].length - this.props.width / 2 - 1;
    if (centerY - this.props.height / 2 < 0)
      centerY = this.props.height / 2;
    else
    if (centerY + this.props.height / 2 >= dungeon.length)
      centerY = dungeon.length - this.props.height / 2 - 1;
    
    var width = this.props.width;
    var height = this.props.height;
    
    var dark = this.state.dark;

    return React.DOM.table(null,
      React.DOM.thead(null,
        dungeon.slice(centerY - height / 2, centerY + height / 2 + 1).map(
          function(row, rowNbr)
          {
            return React.DOM.tr({ key: rowNbr },
              row.slice(centerX - width / 2, centerX + width / 2 + 1).map( 
              function(cell, colNbr)
              {
                return React.DOM.td(
                {
                  key: colNbr,
                  style: determineStyleParams(cell, dark)
                });
              })
            );
          }
        )
      )
    );
  }
});

var ViewPortComponent = ReactDOM.render(
  React.createElement(ViewPort,
  {
    initialCenterX: playerCol,
    initialCenterY: playerRow,
    initialDungeon: dungeon
  }),
  document.getElementById("view-port"));

document.onkeydown =  onKeyDown;

var PlayerState = React.createClass(
{
  getInitialState: function()
  {
    return { weapon: this.props.weapon, weaponDamage: this.props.weaponDamage,
      health: this.props.health, experience: this.props.experience, 
      level: this.props.level };
  },
  render: function()
  {
    return (
      <span>
        <h4>Weapon: <em>{this.state.weapon}</em></h4><br />
        <h4>Damage: {this.state.weaponDamage}</h4><br />
        <h4>Health: {this.state.health}</h4><br />
        <h4>XP: {this.state.experience}</h4><br />
        <h4>Level: {this.state.level}</h4>
      </span>);
  }
});

var player = dungeon[playerRow][playerCol];
var PlayerStateComponent = ReactDOM.render(
  React.createElement(PlayerState,
  {
    weapon: player.weapon,
    weaponDamage: player.weaponDamage,
    health: player.health,
    experience: player.experience,
    level: player.level
  }), document.getElementById("info"));

var ToggleMapButton = React.createClass(
{
  getDefaultProps: function()
  {
    return { initialText: "Show map", onClick: function(event) {} };
  },
  getInitialState: function()
  {
    return { text: this.props.initialText, show: true }; 
  },
  render: function()
  {
    return (<button onClick={this._onClick}>{this.state.text}</button>);
  },
  _onClick: function(event)
  {
    if (this.props.onClick)
      this.props.onClick(event);
    if (this.state.show)
      this.setState({ text: "Hide map", show: !this.state.show });
    else
      this.setState({ text: "Show map", show: !this.state.show });
  }
});

var ToggleMapButtonComponent = ReactDOM.render(
  React.createElement(ToggleMapButton, { onClick: toggleMap}),
  document.getElementById("toggle-map-button"));

function toggleMap()
{
  ViewPortComponent.setState({ dark: !ViewPortComponent.state.dark });
}
