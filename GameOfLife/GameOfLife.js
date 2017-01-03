function generateRandomTable(rows, cols)
{
  var model = [];
  for (var i = 0; i < rows; i++)
  {
    var row = [];
    for (var j = 0; j < cols; j++)
      row.push(Math.random() >= 0.5);
    model.push(row);
  }
  return model;
}

function countLiveNeighbors(model, row, col)
{
  var count = 0;
    
  // top left
  for (var i = -1; i <= 1; i++)
  {
    var y = row + i;
    if (y < 0)
      y = model.length - 1;
    else
    if (y >= model.length)
      y = 0;
    for (var j = -1; j <= 1; j++)
    {
      var x = col + j;
      if (x < 0)
        x = model[0].length - 1;
      else
      if (x >= model[0].length)
        x = 0;
  
      if ((x != col || y != row) && model[y][x])
        count++;
    }
  }

  return count;
}

function computeGeneration()
{
  var newModel = [];
  
  for (var row = 0; row < model.length; row++)
  {
    newModel.push([]);
    
    for (var col = 0; col < model[0].length; col++)
    {
      var neighbors = countLiveNeighbors(model, row, col);
      if (model[row][col] === true)   // cell is alive
        newModel[row].push(neighbors === 2 || neighbors === 3);
      else    // cell is dead
        newModel[row].push(neighbors === 3);
    }
  }
  
  GridComponent.setState({ model: newModel });
  GenerationsCounterComponent.setState({ generationsCounter: ++generationsCounter });

  model = newModel;
}

function clearGrid()
{
  var newModel = [];
  for (var rows = 0; rows < model.length; rows++)
  {
    newModel.push([]);
    for (var cols = 0; cols < model[0].length; cols++)
      newModel[rows].push(false);
  }

  GridComponent.setState({ model: newModel });
  GenerationsCounterComponent.setState({ generationsCounter: 0 });

  model = newModel;
  generationsCounter = 0;
}

function computeNextGeneration()
{
  computeGeneration();
  setTimeout(function()
  {
    if (started)
      computeNextGeneration();
    else
    if (clearRequested)
    {
      clearGrid();
      clearRequested = false;
    }
  }, 1);
}

function onStartStopButtonClick(event)
{
  if (!started)
    StartStopButtonComponent.setState({ text: "Stop", started: true });
  else
    StartStopButtonComponent.setState({ text: "Start", started: false });
  started = !started;

  if (started)
    computeNextGeneration();
}

function onClearButtonClick(event)
{
  if (!started)
    clearGrid();
  else
  {
    started = false;
    clearRequested = true;
    clearGrid();
    generateRandomTable(model.length, model[0].length);
    generationsCounter = 0;
    GenerationsCounterComponent.setState({ generationsCounter: 0 });
    StartStopButtonComponent.setState({ text: "Start" });
  }
}

var GenerationsCounter = React.createClass(
{
  getInitialState: function()
  {
    return { generationsCounter: this.props.generationsCounter };
  },
  render: function()
  {
    return (<span>Generation number:&nbsp;{this.state.generationsCounter}</span>);
  }
});

var StartStopButton = React.createClass(
{
  getDefaultProps: function()
  {
    return { started: false, text: "Start", onClick: undefined };
  },
  getInitialState: function()
  {
    return { started: this.props.started, text: this.props.text };
  },
  render: function()
  {
    return (<button class="button" onClick={this._onClick}>{this.state.text}</button>);
  },
  _onClick: function(event)
  {
    if (this.props.onClick)
      this.props.onClick(event);
  }
});

var ClearButton = React.createClass(
{
  render: function()
  {
    return (<button class="button" onClick={this._onClick}>Clear</button>);
  },
  _onClick: function(event)
  {
    if (this.props.onClick)
      this.props.onClick(event);
  }
});

var Grid = React.createClass(
{
  getDefaultProps: function()
  {
    return { model: [[]] };
  },
  getInitialState: function()
  {
    return { model: this.props.model };
  },
  render: function()
  {
    var thisRef = this;
    return (
      <table>
        <tbody>
        {
          this.state.model.map(function(row, rowNbr)
          {
            return (
              <tr>{row.map(function(data, colNbr)
                {
                  return (<td id={rowNbr + "-" + colNbr} onClick={thisRef._onClick} 
                    style={(data ? {background: "red"} : {})}></td>);
                })}</tr>
            )
          })
        }
        </tbody>
      </table>
    );
  },
  _onClick: function(event)
  {
    var a = event.target.id.split("-");
    var rowNbr = Number(a[0]);
    var colNbr = Number(a[1]);
    model[rowNbr][colNbr] = !model[rowNbr][colNbr];
    GridComponent.setState(model);
  }
});

var model = generateRandomTable(50, 70);
var generationsCounter = 0;
var started = false;
var clearRequested = false;
var resetRequested = false;

var GenerationsCounterComponent = ReactDOM.render(
  React.createElement(GenerationsCounter, { generationsCounter: 0 }),
  document.getElementById("generations-counter"));

var StartStopButtonComponent = ReactDOM.render(
  React.createElement(StartStopButton, { onClick: onStartStopButtonClick }),
  document.getElementById("start-stop-button"));

var ClearButtonComponent = ReactDOM.render(
  React.createElement(ClearButton, { onClick: onClearButtonClick }),
  document.getElementById("clear-button"));

var GridComponent = ReactDOM.render(
  React.createElement(Grid, { model: model }),
  document.getElementById("table"));


