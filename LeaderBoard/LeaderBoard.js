function formatNbr(n)
{
  return (n < 10 ? "0" : "") + n;
}

function formatDate(date)
{
  date = new Date(date);
  return date.getFullYear() + "/" + formatNbr(date.getMonth() + 1) + "/" +
    formatNbr(date.getDate()) + "  " + formatNbr(date.getHours()) + ":" +
    formatNbr(date.getMinutes()) + ":" + formatNbr(date.getSeconds());
}

/*
Table code adapted from examples in "React Up & Running" by Stoyan Stefanov.
*/
var Table = React.createClass(
{
  propTypes: 
  {
    initialData: React.PropTypes.array
  },
  getInitialState: function() 
  {
    return { data: this.props.initialData, sortby: null, descending: false };
  },
  _sort: function(e) 
  {
    var column = e.target.cellIndex;
    var data = this.state.data.slice();
    var descending = this.state.sortby === column && !this.state.descending;
    if (column === 0)
    {
      data.sort(function(a, b)
      {
        if (descending)
          return (a[column].username < b[column].username ? 1 : -1);
        return (a[column].username > b[column].username ? 1 : -1);
      });  
    }
    else
    if (column === 3)
    {
      data.sort(function(a, b)
      {
        var x = new Date(a[column]);
        var y = new Date(b[column]);
        x = x.getFullYear() * 10000000000 + x.getMonth() * 100000000 +
          x.getDate() * 1000000 + x.getHours() * 10000 + x.getMinutes() * 100 +
          x.getSeconds();
        y = y.getFullYear() * 10000000000 + y.getMonth() * 100000000 +
          y.getDate() * 1000000 + y.getHours() * 10000 + y.getMinutes() * 100 +
          y.getSeconds();
        if (descending)
          return y - x;
        return x - y;
      });
    }
    else  
    {
      data.sort(function(a, b) 
      {
        if (descending)
          return (a[column] < b[column] ? 1 : -1);
        return (a[column] > b[column] ? 1 : -1);
      });
    }
    this.setState({
      data: data,
      sortby: column,
      descending: descending,
    });
  },
  render: function() 
  {
    return (
      React.DOM.table({ className: "table table-striped table-bordered" },
        React.DOM.thead({onClick: this._sort},
          React.DOM.tr(null,
            ["User", "Recent", "All Time", "Last Update"].map(function(title, idx) 
            {
              if (this.state.sortby === idx) 
                title += this.state.descending ? ' \u2191' : ' \u2193'
              return React.DOM.th({key: idx}, title);
            }, this)
          )
        ),
        React.DOM.tbody(null,
          this.state.data.map(function(row, idx) 
          {
            return (React.DOM.tr({ key: idx },
              row.map(function(cell, idx) 
              {
                if (idx === 0)
                {
                  return React.DOM.td(null, 
                    React.DOM.div({ className: "username-cell"},
                      React.DOM.img({ className: "img-thumbnail", src: cell.img, width: "50px", 
                        height: "50px" }),cell.username));
                }
                if (idx === 3)
                {
                  return React.DOM.td(null,
                    React.DOM.div({ className: "cell" }, formatDate(cell)));
                }  
                return React.DOM.td(null,
                    React.DOM.div({ className: "cell" }, cell));
              })
            ));
          })
        )
      )
    );
  }
});
      
var TableComponent = ReactDOM.render(
  React.createElement(Table, 
  {
    initialData: [],
  }),
  document.getElementById("table")
);

$.ajax(
{
  url: "https://fcctop100.herokuapp.com/api/fccusers/top/recent",
  method: "GET",
  dataType: "json",  // Cross-domain "jsonp" is not needed for some reason.
  success: function(json)
  {
    var newData = json.map(function(obj)
    {
      var userInfo = { username: obj.username, img: obj.img };
      return [userInfo, obj.recent, obj.alltime, obj.lastUpdate];
    });
    TableComponent.setState({ data: newData });
  },
  error: function(jqXHR, textStatus, errorThrown)
  {
    window.alert(textStatus + ": " + errorThrown);
  }
});

