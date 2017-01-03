var initText = 
"Heading\n" +
"=======\n" +
"\n" +
"Sub-heading\n" +
"-----------\n" +
" \n" +
"### Another deeper heading\n" +
" \n" +
"Paragraphs are separated by a blank line.\n" +
"\n" +
"Leave 2 spaces at the end of a line to do a line break\n" +
"\n" +
"Text attributes *italic*, **bold**, `monospace`, ~~strikethrough~~ .\n" +
"\n" +
"Shopping list:\n" +
"\n" +
"  * apples\n" +
"  * oranges\n" +
"  * pears\n" +
"\n" +
"Numbered list:\n" +
"\n" +
"  1. apples\n" +
"  2. oranges\n" +
"  3. pears\n" +
"\n" +
"The rain---not the reign---in Spain.\n" +
"\n" +
" *[Bob Sutton](https://freecodecamp.com/anischyros)*";
               
marked.setOptions(
{
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

var TextField = React.createClass(
{
  propType:
  {
    text: React.PropTypes.string
  },
  getDefaultProps: function()
  {
    return { text: "" };
  },
  render: function()
  {
    return React.DOM.textarea(
    {
      value: this.state.text,
      onChange: this._textChange
    });
  },
  getInitialState: function()
  {
    return { text: this.props.text };
  },
  _textChange: function(event)
  {
    this.setState({ text: event.target.value });
    document.getElementById("right-panel").innerHTML = 
      marked(event.target.value);
  }
});

ReactDOM.render(
  React.createElement(TextField, {text: initText}), document.getElementById("left-panel"));

document.getElementById("right-panel").innerHTML = marked(initText);

