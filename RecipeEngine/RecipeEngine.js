/*****
 *
 * bshrcl.js -- Bob Sutton's Homespun React Class Library
 *
 *****/

/*
 * Button class
 */
function Button(text, domAttachId, className, onClick)
{
  this.text = text;
  this.domAttachId = domAttachId;
  this.className = className;
  this.onClick = onClick;
  var button = React.createClass(
  {
    getDefaultProps: function()
    {
      return { text: "", className: "", onClick: function() {} };
    },
    getInitialState: function()
    {
      return { text: this.props.text, disabled: false }
    },
    render: function()
    {
      return (
        <button onClick={this.props.onClick} 
          className={this.props.className ? this.props.className : ""}
          disabled={this.state.disabled}>{this.state.text}</button>
      );
    }
  });

  this.component = ReactDOM.render(
     React.createElement(button,
    {
      text: this.text,
      className: this.className,
      onClick: this.onClick
    }),
    document.getElementById(this.domAttachId));
}

Button.prototype.disabled = function(disabled)
{
  this.component.setState({ disabled: disabled });
}

Button.prototype.isDisabled = function()
{
  return this.component.state.disabled;
}

Button.prototype.setText = function(text)
{
  this.component.setState({ text: text });
}

Button.prototype.getText = function()
{
  if (!this.component)
    return undefined;
  return this.component.state.text;
}

Button.prototype.getComponent = function()
{
  return this.component;
}


/*
 *  Text field component
 */
function TextField(text, domAttachId, className, readOnly, placeholder, onChange)
{
  this.text = text;
  this.domAttachId = domAttachId;
  this.className = className;
  this.readOnly = readOnly;
  this.placeholder = placeholder;
  this.onChange = onChange;
  
  var textField = React.createClass(
  {
    getDefaultProps: function()
    {
      return { text: "", className: "", readOnly: false, placeholder: "" };
    },
    getInitialState: function()
    {
      return { text: this.props.text, className: this.props.className,
        readOnly: this.props.readOnly, placeholder: this.props.placeholder,
        onChange: this.props.onChange };
    },
    render: function()
    {
      return (
        <input type="text" defaultValue={this.props.text} value={this.state.text}
          readOnly={this.state.readOnly } placeholder={this.props.placeholder} 
          onChange={this._onChange} />
      );
    },
    _onChange: function(event)
    {
      if (this.props.onChange)
        this.props.onChange(event);
      else
        this.setState({ text: event.target.value });
    }
  });
  
  this.component = ReactDOM.render(
    React.createElement(textField,
    {
      text: this.text,
      className: this.className,
      readOnly: this.readOnly,
      placeholder: this.placeholder,
      onChange: this.onChange
    }),
    document.getElementById(this.domAttachId));
}

TextField.prototype.setText = function(text)
{
  this.component.setState({ "text": text });
}

TextField.prototype.getText = function()
{
  return this.component.state.text;
}

TextField.prototype.setReadOnly = function(readOnly)
{
  this.component.setState({ readOnly: readOnly })
}

TextField.prototype.isReadOnly = function()
{
  return this.component.state.readOnly;
}

TextField.prototype.getComponent = function()
{
  return this.component;
}


/*
 * TextArea class
 */
function TextArea(text, domAttachId, className, readOnly, placeholder, onChange)
{
  this.text = text;
  this.domAttachId = domAttachId;
  this.className = className;
  this.readOnly = readOnly;
  this.placeholder = placeholder;
  this.onChange = onChange;
    
  var textArea = React.createClass(
  {
    getDefaultProps: function()
    {
      return { text: "", className: "", readOnly: false, placeholder: "" };
    },
    getInitialState: function()
    {
      return { text: this.props.text, className: this.props.className, 
        readOnly: this.props.readOnly, onChange: this.props.onChange };
    },
    render: function()
    {
      return (
        <textarea defaultValue={this.props.text} value={this.state.text} 
          className={this.state.className} readOnly={this.state.readOnly} 
          placeholder={this.props.placeholder} onChange={this._onChange}></textarea>
      );    
    },
    _onChange: function(event)
    {
      if (this.props.onChange)
        this.props.onChange(event);
      else
        this.setState({ text: event.target.value });
    }
  });
  
  this.component = ReactDOM.render(
    React.createElement(textArea,
    {
      text: this.text,
      className: this.className,
      readOnly: this.readOnly,
      placeholder: this.placeholder,
      onChange: this.onChange
    }),
    document.getElementById(this.domAttachId));
}

TextArea.prototype.setText = function(text)
{
  this.component.setState({ "text": text });
}

TextArea.prototype.getText = function()
{
  return this.component.state.text;
}

TextArea.prototype.getComponent = function()
{
  return this.component;
}

/*
 * SelectableList class
 */
function SelectableList(itemsList, domAttachId, className, onSelection)
{
  this.itemsList = itemsList;
  this.domAttachId = domAttachId;
  this.className = className;
  this.onSelection = onSelection;

  var ul = React.createClass(
  {
    getDefaultProps: function()
    {
      return { itemsList: [], className: "", onSelection: function() {} };
    },
    getInitialState: function()
    {
      return { itemsList: this.props.itemsList, className: this.props.className,
        selectedId: undefined };
    },
    render: function()
    {
      var liList = [];
      for (var i = 0; i < this.state.itemsList.length; i++)
      {
        var classNames = "list-group-item";
        var className = this.state.itemsList[i].className;
        if (className)
          classNames += " " + className;
        if (this.state.selectedId === this.state.itemsList[i].id)
          classNames += " active";
        
        liList.push(
          <li id={this.state.itemsList[i].id} key={this.state.itemsList[i].id}
            className={classNames}>{this.state.itemsList[i].text}</li>
        );
      }
      
      return (
        <ul className={"list-group " + this.state.className} onClick={this._onClick}>{liList}</ul>
      );
    },
    _onClick: function(event)
    {
      // Get id of selected item
      var selectedId = event.target.id;
      this.setState({ selectedId: selectedId });
      this.props.onSelection(selectedId);
    }
  });
  
  this.component = ReactDOM.render(
    React.createElement(ul,
    {
      itemsList: this.itemsList,
      className: this.className,
      onSelection: this.onSelection
    }),
    document.getElementById(this.domAttachId));
}

SelectableList.prototype.clearSelection = function()
{
  this.component.setState({ selectedId: undefined });
}

SelectableList.prototype.getSelectedId = function()
{
  return this.component.state.selectedId;
}

SelectableList.prototype.update = function(itemsList)
{
  this.component.setState({ itemsList: itemsList, selectedId: undefined });
}

SelectableList.prototype.addItem = function(id, name)
{
  var itemsList = this.component.state.itemsList.map(function(it) {return it});
  itemsList.push({ id: id, text: name });
  this.component.setState({ itemsList: itemsList });
}

SelectableList.prototype.removeItem = function(id)
{
  var itemsList = this.component.state.itemsList.map(function(it) {return it});
  var selectedId = this.component.state.selectedId;
  if (this.component.state.selectedId === id)
    selectedId = undefined;
  for (var i = 0; i < itemsList.length; i++)
  {
    if (itemsList[i].id === id)
    {
      itemsList.splice(i, 1);
      break;
    }
  }
  this.component.setState({ itemsList: itemsList, selectedId: selectedId });
}

SelectableList.prototype.getComponent = function()
{
  return this.component;
}

/******
 *
 * End of bshrcl.js
 *
 *****/

function onNewButton()
{
  // Clear fields
  newRecipeTextField.setText("");
  newRecipeTextArea.setText("");
  
  // Display dialog
  $("#new-recipe-dialog").dialog(
  {
    title: "Enter new recipe",
    modal: true,
    width: 500,
    height: 400
  });
}

function onEditButton()
{
  var selectedId = recipeList.getSelectedId();
  if (!selectedId)
    return;
  
  var recipes = JSON.parse(localStorage.recipes);
  var recipe;
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === selectedId)
    {
      recipe = recipes[i];
      break;
    }
  }
  if (!recipe)
    return;
  
  editRecipeTextField.setText(recipe.name);
  editRecipeTextArea.setText(recipe.ingredients.reduce(
    function(a, it) { return a + "\n" + it; }));

  $("#edit-recipe-dialog").dialog(
  {
    title: "Edit recipe",
    modal: true,
    width: 500,
    height: 400
  });
}

function deleteRecipe(id)
{
  // Get list of recipes from local storage
  var recipes = JSON.parse(localStorage.recipes);
  
  // Delete matching recipe
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === id)
    {
      recipes.splice(i, 1);
      break;
    }
  }
  
  // Update recipe list in local storage
  localStorage.recipes = JSON.stringify(recipes);
  
  // Update GUI
  recipeList.removeItem(id);
  recipeTextArea.setText("");
  editButton.disabled(true);
  deleteButton.disabled(true);
}

function onDeleteButton()
{
  var id = recipeList.getSelectedId();
  
  var recipes = JSON.parse(localStorage.recipes);
  
  var recipe;
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === id)
    {
      recipe = recipes[i];
      break;
    }
  }
  if (!recipe)
    return;
  
  $("<div><p>Are you sure you want to delete the recipe named " + recipe.name + 
    "?</p></div>").dialog(
  {
    title: "Recipe deletion confirmation",
    resizable: false,
    height: "auto",
    width: 300,
    modal: true,
    buttons: 
    {
      "Delete selected recipe": function() 
      {
        deleteRecipe(id);
        $(this).dialog("close");
      }
    }
  });
}

function onListSelection(selectedId)
{
  // Enable edit and delete buttons
  editButton.disabled(false);
  deleteButton.disabled(false);
  
  // Put text in recipe text area
  var recipes = JSON.parse(localStorage.recipes);
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === selectedId)
    {
      recipeTextArea.setText(recipes[i].ingredients.reduce(function(a, it)
      {
        return a + "\n" + it;
      }));
      break;
    }
  }
}

function recipesListToListItems()
{
  var recipes = JSON.parse(localStorage.recipes);
  return recipes.map(function(recipe)
  {
    return { id: recipe.name.replace(/[ \-]/g, "_"), text: recipe.name };
  });
}

function newRecipeTextFieldValidator(event)
{
  newRecipeTextField.setText(event.target.value);
  
  createNewRecipeButton.disabled(
    event.target.value.trim().length === 0 || 
    newRecipeTextArea.getText().trim().length === 0);
}

function newRecipeTextAreaValidator(event)
{
  newRecipeTextArea.setText(event.target.value);
  
  createNewRecipeButton.disabled(
    newRecipeTextField.getText().trim().length === 0 || 
    event.target.value.trim().length === 0);
}

function editRecipeTextAreaValidator(event)
{
  editRecipeTextArea.setText(event.target.value);
  
  updateRecipeButton.disabled(
    editRecipeTextField.getText().trim().length === 0 || 
    event.target.value.trim().length === 0);
}

function updateRecipe(id, name, ingredients)
{
  // Parse ingredients into string array
  ingredients = ingredients.split("\n");
  for (var i = 0; i < ingredients.length; i++)
    ingredients[i] = ingredients[i].trim();
  for (var i = ingredients.length - 1; i >= 0; i--)
    if (ingredients[i].length === 0)
      ingredients.splice(i, 1);
  
  // Update database
  var recipes = JSON.parse(localStorage.recipes);
  recipes.push({ id: id, name: name, ingredients: ingredients });
  localStorage.recipes = JSON.stringify(recipes);
  
  // Update list of recipes
  recipeList.addItem(id, name);
}

function onCreateNewRecipeButton()
{
  var recipes = JSON.parse(localStorage.recipes);
  
  var name = newRecipeTextField.getText();
  var ingredients = newRecipeTextArea.getText();
  var id = name.replace(/[ \-]/g, "_");

  var found = false;
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === id)
    {
      found = true;
      break;
    }
  }
  if (!found)
  {
    updateRecipe(id, name, ingredients);
    $("#new-recipe-dialog").dialog("close");
    return;
  }
  
  $("<div><p>This recipe already exists.  Are you sure you want to replace it?</p></div>")
    .dialog(
  {
    title: "Recipe replacement confirmation",
    resizable: false,
    height: "auto",
    width: 300,
    modal: true,
    buttons: 
    {
      "Replace it": function() 
      {
        $(this).dialog("close");
        
        recipes.splice(i, 1);
        localStorage.recipes = JSON.stringify(recipes);
        updateRecipe(id, name, ingredients);
        $("#new-recipe-dialog").dialog("close");
      }
    }
  });
}

function onUpdateRecipeButton()
{
  // Close dialog
  $("#edit-recipe-dialog").dialog("close");
  
  // Get select recipe id
  var selectedId = recipeList.getSelectedId();

  // Get field contents
  var name = editRecipeTextField.getText();
  var ingredients = editRecipeTextArea.getText().split("\n");
  for (var i = ingredients.length - 1; i >= ingredients; i++)
  {
    if (ingredients[i].trim().length === 0)
      ingredients.splice(i, 1);
  }
  
  // Update recipes list
  var recipes = JSON.parse(localStorage.recipes);
  for (var i = 0; i < recipes.length; i++)
  {
    if (recipes[i].id === selectedId)
    {
      recipes[i].name = name;
      recipes[i].ingredients = ingredients;
      break;
    }
  }
  localStorage.recipes = JSON.stringify(recipes);
  
  // Update displayed recipe ingredients
  recipeTextArea.setText(ingredients.reduce(
    function(a, it) { return a + "\n" + it; }));
}

function mergeRecipesIntoStoredRecipes(recipes)
{
  var storedRecipes = localStorage.recipes;
  if (!storedRecipes)
  {
    localStorage.recipes = JSON.stringify(recipes);
    return;
  }
  
  storedRecipes = JSON.parse(storedRecipes);

  for (var i = 0; i < recipes.length; i++)
  {
    var found = false;
    for (var j = 0; j < storedRecipes.length; j++)
    {
      if (recipes[i].id === storedRecipes[j].id)
      {
        found = true;
        break;
      }
    }
    
    if (!found)
      storedRecipes.push(recipes[i]);
  }
  
  localStorage.recipes = JSON.stringify(storedRecipes);
}

// Load recipes into local storage if they aren't already there
var recipes = [];
recipes.push(
{
  id: "Country_Style_Chicken_Kiev",
  name: "Country-Style Chicken Kiev",
  ingredients: ["Boneless, skinless chicken breasts", "Oregano", "Basil",
    "Garlic clove", "Salt", "Chopped green onions", "Butter", "Chopped parsley",
    "Bread crumbs", "Ground Parmasean cheese"]
});
recipes.push(
{
  id: "Chicken_Paprikash",
  name: "Chicken Paprikash",
  ingredients: ["Dark-meat chicken quarters", "Paprika", "Yellow Onion",
    "Anaheim pepper", "Sour cream", "Salt", "Butter", "Chicken stock", "Flour",
    "Black pepper"]
});
recipes.push(
{
  id: "Kentucky_Fried_Chicken",
  name: "Kentucky Fried Chicken",
  ingredients: ["Chicken pieces", "Flour", "Salt", "Thyme", "Basil", "Oregano",
    "Celery salt", "Black pepper", "Dried mustard", "Paprika", "Garlic salt",
    "Ground ginger", "White pepper"]
});

mergeRecipesIntoStoredRecipes(recipes);

// Create main GUI components
var recipeList = new SelectableList(recipesListToListItems(), "recipe-list", "", onListSelection);
var recipeTextArea = new TextArea("", "recipe-text", "", true, 
  "Recipe ingredients will appear here");
var newButton = new Button("New", "new-recipe-button", "button", onNewButton);
var editButton = new Button("Edit", "edit-recipe-button", "button", onEditButton);
editButton.disabled(true);
var deleteButton = new Button("Delete", "delete-recipe-button", "button", onDeleteButton);
deleteButton.disabled(true);

// Create new recipe dialog components
var newRecipeTextField = new TextField("", "new-recipe-text-field", "", false, "Recipe Name",
  newRecipeTextFieldValidator);
var newRecipeTextArea = new TextArea("", "new-recipe-text-area", "", false, "Recipe Ingredients",
  newRecipeTextAreaValidator);
var createNewRecipeButton = new Button("Create New Recipe", "create-new-recipe-button", "button",
  onCreateNewRecipeButton);
createNewRecipeButton.disabled(true);

// Create edit recipe dialog components
var editRecipeTextField = new TextField("", "edit-recipe-text-field", "", false, "Recipe Name");
editRecipeTextField.setReadOnly(true);
var editRecipeTextArea = new TextArea("", "edit-recipe-text-area", "", false, 
  "Recipe Ingredients", editRecipeTextAreaValidator);
var updateRecipeButton = new Button("Update Recipe", "update-recipe-button", "button",
  onUpdateRecipeButton);
updateRecipeButton.disabled(true);
