
# [Cell functions](https://handsontable.com/docs/javascript-data-grid/cell-function/#cell-functions)

Render, edit, and validate the contents of your cells, using Handsontable's cell functions. Quickly set up your cells, using cell types.

## [Overview](https://handsontable.com/docs/javascript-data-grid/cell-function/#overview)

With every cell in the Handsontable there are 3 associated functions:

-   [Renderer](https://handsontable.com/docs/javascript-data-grid/cell-function/#renderer)
-   [Editor](https://handsontable.com/docs/javascript-data-grid/cell-function/#editor)
-   [Validator](https://handsontable.com/docs/javascript-data-grid/cell-function/#validator)

Each of those functions are responsible for a different cell behavior. You can define them separately or use a  [cell type](https://handsontable.com/docs/javascript-data-grid/cell-function/#cell-type)  to define all three at once.

## [Renderer](https://handsontable.com/docs/javascript-data-grid/cell-function/#renderer)

Handsontable does not display the values stored in the data source directly. Instead, every time a value from data source needs to be displayed in a table cell, it is passed to the cell  `renderer`  function, together with the table cell object of type  `HTMLTableCellElement`  (DOM node), along with other useful information.

`Renderer`  is expected to format the passed value and place it as a content of the cell object.  `Renderer`  can also alter the cell class list, i.e. it can add a  `htInvalid`  class to let the user know, that the displayed value is invalid.

## [Editor](https://handsontable.com/docs/javascript-data-grid/cell-function/#editor)

Cell editors are the most complex cell functions. We have prepared a separate page  [custom cell editor](https://handsontable.com/docs/javascript-data-grid/cell-editor/)  explaining how cell edit works and how to write your own cell editor.

## [Validator](https://handsontable.com/docs/javascript-data-grid/cell-function/#validator)

Cell validator can be either a function or a regular expression. A cell is considered valid, when the validator function calls a  `callback`  (passed as one of the  `validator`  arguments) with  `true`  or the validation regex  [`test()` (opens new window)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)method returns  `true`. Because the validity of a value is determined only by the argument that is passed to  `callback`,  `validator`  function can be synchronous or asynchronous.

Contrary to  `renderer`  and  `editor`  functions, the  `validator`  function doesn't have to be defined for each cell. If the  `validator`  function is not defined, then a cell value is always valid.

## [Cell type](https://handsontable.com/docs/javascript-data-grid/cell-function/#cell-type)

Manually defining those functions for cells or columns would be tedious, so to simplify the configuration, Handsontable introduced  [cell types](https://handsontable.com/docs/javascript-data-grid/cell-type/).

## [Cell functions getters](https://handsontable.com/docs/javascript-data-grid/cell-function/#cell-functions-getters)

If, for some reason, you need to get the  `renderer`,  `editor`  or  `validator`  function of a specific cell, you can use the standard  [`getCellMeta()`](https://handsontable.com/docs/javascript-data-grid/api/core/#getcellmeta)  method to get all properties of a cell, and then refer to the cell functions like this:

```
// get cell properties for cell [0, 0]
const cellProperties = hot.getCellMeta(0, 0);

cellProperties.renderer; // get cell renderer
cellProperties.editor; // get cell editor
cellProperties.validator; // get cell validator
cellProperties.type; // get cell type

```

You can also get specific cell functions by using the following getters:

-   [`getCellRenderer(row, col)`](https://handsontable.com/docs/javascript-data-grid/api/core/#getcellrenderer)
-   [`getCellEditor(row, col)`](https://handsontable.com/docs/javascript-data-grid/api/core/#getcelleditor)
-   [`getCellValidator(row, col)`](https://handsontable.com/docs/javascript-data-grid/api/core/#getcellvalidator)

If a cell's functions are defined through a  [cell type](https://handsontable.com/docs/javascript-data-grid/cell-function/#cell-type), the getters will return the  `renderer`,  `editor`  or  `validator`  functions defined for that cell type. For example:

```
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

const container = document.querySelector('#container');
const hot = new Handsontable(container, {
  columns: [{
    // set a cell type for the entire grid
    type: 'numeric'
  }]
});

// get cell properties for cell [0, 0]
const cellProperties = hot.getCellMeta(0, 0);

cellProperties.renderer; // numericRenderer
cellProperties.editor; // NumericEditor
cellProperties.validator; // numericValidator
cellProperties.type; // numeric

```

# [Cell renderer](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#cell-renderer)

Create a custom cell renderer function, to have full control over how a cell looks.

On this page

-   [Overview](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#overview)
-   [Use a cell renderer](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#use-a-cell-renderer)
-   [Register custom cell renderer](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#register-custom-cell-renderer)
-   [Use an alias](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#use-an-alias)
-   [Render custom HTML in cells](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#render-custom-html-in-cells)
-   [Render custom HTML in header](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#render-custom-html-in-header)
-   [Add event listeners in cell renderer function](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#add-event-listeners-in-cell-renderer-function)
-   [Performance considerations](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#performance-considerations)
-   [Related articles](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#related-articles)
    -   [Related guides](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#related-guides)
    -   [Related API reference](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#related-api-reference)

## [Overview](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#overview)

When you create a renderer, a good idea is to assign it as an alias that will refer to this particular renderer function. Handsontable defines 10 aliases by default:

-   `autocomplete`  for  `Handsontable.renderers.AutocompleteRenderer`
-   `base`  for  `Handsontable.renderers.BaseRenderer`
-   `checkbox`  for  `Handsontable.renderers.CheckboxRenderer`
-   `date`  for  `Handsontable.renderers.DateRenderer`
-   `dropdown`  for  `Handsontable.renderers.DropdownRenderer`
-   `html`  for  `Handsontable.renderers.HtmlRenderer`
-   `numeric`  for  `Handsontable.renderers.NumericRenderer`
-   `password`  for  `Handsontable.renderers.PasswordRenderer`
-   `text`  for  `Handsontable.renderers.TextRenderer`
-   `time`  for  `Handsontable.renderers.TimeRenderer`

It gives users a convenient way for defining which renderer should be used when table rendering was triggered. User doesn't need to know which renderer function is responsible for displaying the cell value, he does not even need to know that there is any function at all. What is more, you can change the render function associated with an alias without a need to change code that defines a table.

## [Use a cell renderer](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#use-a-cell-renderer)

Use the renderer name of your choice when configuring the column:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  data: someData,
  columns: [
    {
      renderer: "numeric",
    },
  ],
});

```

## [Register custom cell renderer](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#register-custom-cell-renderer)

To register your own alias use  `Handsontable.renderers.registerRenderer()`  function. It takes two arguments:

-   `rendererName`  - a string representing a renderer function
-   `renderer`  - a renderer function that will be represented by  `rendererName`

If you'd like to register  `asterixDecoratorRenderer`  under alias  `asterix`  you have to call:

```
Handsontable.renderers.registerRenderer("asterix", asterixDecoratorRenderer);

```

Choose aliases wisely. If you register your renderer under name that is already registered, the target function will be overwritten:

```
Handsontable.renderers.registerRenderer("text", asterixDecoratorRenderer);

```

Now 'text' alias points to  `asterixDecoratorRenderer`  function, not  `Handsontable.renderers.TextRenderer`.

So, unless you intentionally want to overwrite an existing alias, try to choose a unique name. A good practice is prefixing your aliases with some custom name (for example your GitHub username) to minimize the possibility of name collisions. This is especially important if you want to publish your renderer, because you never know aliases has been registered by the user who uses your renderer.

```
Handsontable.renderers.registerRenderer("asterix", asterixDecoratorRenderer);

```

Someone might already registered such alias

```
Handsontable.renderers.registerRenderer("my.asterix", asterixDecoratorRenderer);

```

That's better.

## [Use an alias](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#use-an-alias)

The final touch is to use registered aliases. That way users can easily refer to an alias without the need to know the name of the function.

To sum up, a well prepared renderer function should look like this:

```
function customRenderer(
  hotInstance,
  td,
  row,
  column,
  prop,
  value,
  cellProperties
) {
  // Optionally include `BaseRenderer` which is responsible for
  // adding/removing CSS classes to/from the table cells.
  Handsontable.renderers.BaseRenderer.apply(this, arguments);

  // ...your custom logic of the renderer
}

// Register an alias
Handsontable.renderers.registerRenderer("my.custom", customRenderer);

```

From now on, you can use  `customRenderer`  like so:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  data: someData,
  columns: [
    {
      renderer: "my.custom",
    },
  ],
});

```

## [Render custom HTML in cells](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#render-custom-html-in-cells)

This example shows how to use custom cell renderers to display HTML content in a cell. This is a very powerful feature. Just remember to escape any HTML code that could be used for XSS attacks. In the below configuration:

-   **Title**  column uses built-in HTML renderer that allows any HTML. This is unsafe if your code comes from untrusted source. Take notice that a Handsontable user can use it to enter  `<script>`  or other potentially malicious tags using the cell editor!
-   **Description**  column also uses HTML renderer (same as above)
-   **Comments**  column uses a custom renderer (`safeHtmlRenderer`). This should be safe for user input, because only certain tags are allowed
-   **Cover**  column accepts image URL as a string and converts it to a  `<img>`  in the renderer
```
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

// Register all Handsontable's modules.
registerAllModules();

const data = [
  {
    title:
      '<a href="https://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691">Professional JavaScript for Web Developers</a>',
    description:
      'This <a href="https://bit.ly/sM1bDf">book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.',
    comments: 'I would rate it &#x2605;&#x2605;&#x2605;&#x2605;&#x2606;',
    cover: 'https://handsontable.com/docs/img/examples/professional-javascript-developers-nicholas-zakas.jpg',
  },
  {
    title: '<a href="https://shop.oreilly.com/product/9780596517748.do">JavaScript: The Good Parts</a>',
    description:
      'This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.',
    comments: 'This is the book about JavaScript',
    cover: 'https://handsontable.com/docs/img/examples/javascript-the-good-parts.jpg',
  },
  {
    title: '<a href="https://shop.oreilly.com/product/9780596805531.do">JavaScript: The Definitive Guide</a>',
    description:
      '<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.',
    comments:
      'I\'ve never actually read it, but the <a href="https://shop.oreilly.com/product/9780596805531.do">comments</a> are highly <strong>positive</strong>.',
    cover: 'https://handsontable.com/docs/img/examples/javascript-the-definitive-guide.jpg',
  },
];

const safeHtmlRenderer = (_instance, td, _row, _col, _prop, value) => {
  // WARNING: Be sure you only allow certain HTML tags to avoid XSS threats.
  // Sanitize the "value" before passing it to the innerHTML property.
  td.innerHTML = value;
};

const coverRenderer = (_instance, td, _row, _col, _prop, value) => {
  const img = document.createElement('img');

  img.src = value;
  img.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });
  td.innerText = '';
  td.appendChild(img);

  return td;
};

const container = document.querySelector('#example4');

new Handsontable(container, {
  themeName: 'ht-theme-main',
  data,
  colWidths: [200, 200, 200, 80],
  colHeaders: ['Title', 'Description', 'Comments', 'Cover'],
  height: 'auto',
  columns: [
    { data: 'title', renderer: 'html' },
    { data: 'description', renderer: 'html' },
    { data: 'comments', renderer: safeHtmlRenderer },
    { data: 'cover', renderer: coverRenderer },
  ],
  autoWrapRow: true,
  autoWrapCol: true,
  licenseKey: 'non-commercial-and-evaluation',
});
```

## [Render custom HTML in header](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#render-custom-html-in-header)

You can also put HTML into row and column headers. If you need to attach events to DOM elements like the checkbox below, just remember to identify the element by class name, not by id. This is because row and column headers are duplicated in the DOM tree and id attribute must be unique.

```
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

// Register all Handsontable's modules.
registerAllModules();

let isChecked = false;
const exampleContainer = document.querySelector('#exampleContainer5');
const container = document.querySelector('#example5');
const customRenderer = (instance, td, ...rest) => {
  Handsontable.renderers.TextRenderer(instance, td, ...rest);

  if (isChecked) {
    td.style.backgroundColor = 'yellow';
  } else {
    td.style.backgroundColor = 'rgba(255,255,255,0.1)';
  }
};

const hot = new Handsontable(container, {
  themeName: 'ht-theme-main',
  height: 'auto',
  columns: [{}, { renderer: customRenderer }],
  colHeaders(col) {
    return col === 0
      ? '<b>Bold</b> and <em>Beautiful</em>'
      : `Some <input type="checkbox" class="checker" ${isChecked ? 'checked="checked"' : ''}> checkbox`;
  },
  autoWrapRow: true,
  autoWrapCol: true,
  licenseKey: 'non-commercial-and-evaluation',
});

exampleContainer.addEventListener('mousedown', (event) => {
  if (event.target.nodeName == 'INPUT' && event.target.className == 'checker') {
    event.stopPropagation();
  }
});
exampleContainer.addEventListener('mouseup', (event) => {
  if (event.target.nodeName == 'INPUT' && event.target.className == 'checker') {
    isChecked = !event.target.checked;
    hot.render();
  }
});
```

## [Add event listeners in cell renderer function](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#add-event-listeners-in-cell-renderer-function)

If you are writing an advanced cell renderer, and you want to add some custom behavior after a certain user action (i.e. after user hover a mouse pointer over a cell) you might be tempted to add an event listener directly to table cell node passed as an argument to the  `renderer`  function. Unfortunately, this will almost always cause you trouble and you will end up with either performance issues or having the listeners attached to the wrong cell.

This is because Handsontable:

-   Calls  `renderer`  functions multiple times per cell - this can lead to having multiple copies of the same event listener attached to a cell
-   Reuses table cell nodes during table scrolling and adding/removing new rows/columns - this can lead to having event listeners attached to the wrong cell

Before deciding to attach an event listener in cell renderer make sure, that there is no  [Handsontable event](https://handsontable.com/docs/javascript-data-grid/events-and-hooks/)  that suits your needs. Using  _Handsontable events_  system is the safest way to respond to user actions.

If you did't find a suitable  _Handsontable event_  put the cell content into a wrapping  `<div>`, attach the event listener to the wrapper and then put it into the table cell.

## [Performance considerations](https://handsontable.com/docs/javascript-data-grid/cell-renderer/#performance-considerations)

Cell renderers are called separately for every displayed cell, during every table render. Table can be rendered multiple times during its lifetime (after table scroll, after table sorting, after cell edit etc.), therefore you should keep your  `renderer`  functions as simple and fast as possible or you might experience a performance drop, especially when dealing with large sets of data.

# [Cell editor](https://handsontable.com/docs/javascript-data-grid/cell-editor/#cell-editor)

Create a custom cell editor function, to have full control over how editing works in the cells of your data grid.

On this page

-   [Overview](https://handsontable.com/docs/javascript-data-grid/cell-editor/#overview)
    -   [EditorManager](https://handsontable.com/docs/javascript-data-grid/cell-editor/#editormanager)
    -   [BaseEditor](https://handsontable.com/docs/javascript-data-grid/cell-editor/#baseeditor)
    -   [How to create a custom editor?](https://handsontable.com/docs/javascript-data-grid/cell-editor/#how-to-create-a-custom-editor)
-   [Registering an editor](https://handsontable.com/docs/javascript-data-grid/cell-editor/#registering-an-editor)
-   [Prepare editor for publication](https://handsontable.com/docs/javascript-data-grid/cell-editor/#prepare-editor-for-publication)
    -   [Enclose in IIFE](https://handsontable.com/docs/javascript-data-grid/cell-editor/#enclose-in-iife)
    -   [Add editor to dedicated namespace](https://handsontable.com/docs/javascript-data-grid/cell-editor/#add-editor-to-dedicated-namespace)
    -   [Register an alias](https://handsontable.com/docs/javascript-data-grid/cell-editor/#register-an-alias)
-   [Related keyboard shortcuts](https://handsontable.com/docs/javascript-data-grid/cell-editor/#related-keyboard-shortcuts)
-   [Related articles](https://handsontable.com/docs/javascript-data-grid/cell-editor/#related-articles)
    -   [Related guides](https://handsontable.com/docs/javascript-data-grid/cell-editor/#related-guides)
    -   [Related API reference](https://handsontable.com/docs/javascript-data-grid/cell-editor/#related-api-reference)

## [Overview](https://handsontable.com/docs/javascript-data-grid/cell-editor/#overview)

Handsontable separates the process of displaying the cell value from the process of changing the value. Renderers are responsible for presenting the data and Editors for altering it. As a renderer has only one simple task:  _get actual value of the cell and return its representation as a HTML code_  they can be a single function. Editors, however, need to handle user input (that is, mouse and keyboard events), validate data and behave according to validation results, so putting all those functionalities into a single function wouldn't be a good idea. That's why Handsontable editors are represented by editor classes.

This tutorial will give you a comprehensive understanding of how the whole process of cell editing works, how Handsontable Core manages editors, how editor life cycle looks like and finally - how to create your own editors.

### [EditorManager](https://handsontable.com/docs/javascript-data-grid/cell-editor/#editormanager)

[`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  is a class responsible for handling all editors available in Handsontable. If  `Handsontable`  needs to interact with editors it uses  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  object.  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  object is instantiated in  [`init()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#init)  method which is run, after you invoke  `Handsontable()`  constructor for the first time. The reference for  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  object is kept private in Handsontable instance and you cannot access it. However, there are ways to alter the default behaviour of  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/), more on that later.

#### EditorManager tasks

[`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  has 4 main tasks:

-   Selecting proper editor for an active cell
-   Preparing editor to be displayed
-   Displaying editor (based on user behavior)
-   Closing editor (based on user behavior).

We will discuss each of those tasks in detail.

##### Select proper editor for an active cell

When user selects a cell  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  finds the editor class assigned to this cell, examining the value of the  [`editor`](https://handsontable.com/docs/javascript-data-grid/api/options/#editor)  configuration option. You can define the  [`editor`](https://handsontable.com/docs/javascript-data-grid/api/options/#editor)  configuration option globally (for all cells in table), per column (for all cells in column) or for each cell individually. For more details, see the  [Configuration options](https://handsontable.com/docs/javascript-data-grid/configuration-options/#cascading-configuration)  guide.

The value of the  [`editor`](https://handsontable.com/docs/javascript-data-grid/api/options/#editor)  configuration option can be either a string representing an editor (such as 'text', 'autocomplete', 'checkbox' etc.), or an editor class.  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  will then get an instance of editor class and the first very important thing to remember is:  **there is always one instance of certain editor class in a single table**, in other words each editor class object  **is a singleton**  within a single table, which means that its constructor will be invoked only once per table. If you have 3 tables on a page, each table will have its own instance of editor class. This has some important implications that you have to consider creating your own editor.

##### Prepare editor to be displayed

When  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  obtain editor class instance (editor object) it invokes its  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method. The  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method sets editor objects properties related to the selected cell, but does not display the editor.  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  is called each time user selects a cell. In some cases it can be invoked multiple times for the same cell, without changing the selection.

##### Display editor

When editor is prepared the  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  waits for user event that triggers cell edition. Those events are:

-   Pressing  **Enter**
-   Pressing  **Shift**+**Enter**
-   double clicking cell
-   Pressing  **F2**

If any of those events is triggered,  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  calls editor's  [`beginEditing()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#beginediting)  method, which should display the editor.

##### Close editor

When editor is opened the  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  waits for user event that should end cell edition. Those events are:

-   Clicking on another cell (saves changes)
-   Pressing  **Enter**  (saves changes and moves selection one cell down)
-   Pressing  **Shift**+**Enter**  (saves changes and moves selection one cell up)
-   Pressing  **Ctrl**/**Cmd**+**Enter**  or  **Alt**/**Option**+**Enter**  (adds a new line inside the cell)
-   Pressing  **Escape**  (aborts changes)
-   Pressing  **Tab**  (saves changes and moves one cell to the right or to the left, depending on your  [layout direction](https://handsontable.com/docs/javascript-data-grid/layout-direction/#elements-affected-by-layout-direction))
-   Pressing  **Shift**+**Tab**  (saves changes and moves one cell to the left or to the right, depending on your  [layout direction](https://handsontable.com/docs/javascript-data-grid/layout-direction/#elements-affected-by-layout-direction))
-   Pressing  **Page Up**,  **Page Down**  (saves changes and moves one screen up/down)

If any of those events is triggered,  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  calls editor's  [`finishEditing()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#finishediting)  method, which should try to save changes (unless ESC key has been pressed) and close the editor.

#### Overriding EditorManager default behaviour

You may want to change the default events that causes editor to open or close. For example, your editor might use  **Arrow Up**  and  **Arrow Down**  events to perform some actions (for example increasing or decreasing cell value) and you don't want  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  to close the editor when user press those keys. That's why  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  runs  [`beforeKeyDown`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforekeydown)  hook before processing user events. If you register a listener for  [`beforeKeyDown`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforekeydown), that call  `stopImmediatePropagation()`  on  `event`  object  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  won perform its default action. More on overriding  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)'s behaviour in section "SelectEditor - creating editor from scratch".

You should now have a better understanding on how  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  works. Let's go a bit deeper and see what methods every editor class must implement and what those methods do.

### [](https://handsontable.com/docs/javascript-data-grid/cell-editor/#baseeditor)[`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)

`Handsontable.editors.BaseEditor`  is an abstract class from which all editor classes should inherit. It implements some of the basic editor methods as well as declares some methods that should be implemented by each editor class. In this section we examine all of those methods.

#### Common methods

Common methods, are methods implemented by  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  class. They contain some core logic that every editor should have. Most of the time, you shouldn't bother with those methods. However, if you are creating some more complex editors, you might want to override some of the common methods, in which case you should always invoke the original method and then perform other operations, specific to your editor.

**Example**  - overriding common method

```
// CustomEditor is a class, inheriting from BaseEditor
class CustomEditor extends BaseEditor {
  prepare(row, col, prop, td, originalValue, cellProperties) {
    // Invoke the original method...
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    // ...and then do some stuff specific to your CustomEditor
    this.customEditorSpecificProperty = "foo";
  }
}

```

There are 7 common methods. All of them are described below.

#### prepare(row:  `Number`, col:  `Number`, prop:  `Number|String`, td:  `HTMLTableCellElement`, originalValue:  `Mixed`, cellProperties:  `Object`)

Prepares editor to be displayed for given cell. Sets most of the instance properties.

Returns:  `undefined`

#### beginEditing(newInitialValue:  `Mixed`, event:  `Mixed`)

Sets editor value to  `newInitialValue`. If  `newInitialValue`  is undefined, the editor value is set to original cell value. Calls  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  method internally.

Returns:  `undefined`

#### finishEditing(restoreOriginalValue: 'Boolean'  _[optional]_, ctrlDown:  `Boolean`  _[optional]_, callback:  `Function`)

Tries to finish cell edition. Calls  [`saveValue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#savevalue)  and  `discardEditor()`  internally. If  `restoreOriginalValue`  is set to  `true`  cell value is being set to its original value (from before the edition).  `ctrlDown`  value is passed to  [`saveValue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#savevalue)  as the second argument.

Callback function contains a boolean parameter - if new value is valid or the  [`allowInvalid`](https://handsontable.com/docs/javascript-data-grid/api/options/#allowinvalid)  configuration option is set to  `true`, otherwise the parameter is  `false`.

#### discardEditor(result:  `Boolean`)

Called when cell validation ends. If new value is saved successfully (`result`  is set to  `true`  or  [`allowInvalid`](https://handsontable.com/docs/javascript-data-grid/api/options/#allowinvalid)  property is  `true`) it calls  [`close()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#close)  method, otherwise calls  [`focus()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#focus)  method and keeps editor opened.

Returns:  `undefined`

#### saveValue(value:  `Mixed`, ctrlDown:  `Boolean`)

Tries to save  `value`  as new cell value. Performs validation internally. If  `ctrlDown`  is set to true the new value will be set to all selected cells.

Returns:  `undefined`

##### isOpened()

Returns  `true`  if editor is opened or  `false`  if editor is closed. Editor is considered to be opened after  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  has been called. Editor is considered closed  [`close()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#close)  after method has been called.

Returns:  `Boolean`

##### extend()

Returns:  `Function`  - a class function that inherits from the current class. The  `prototype`  methods of the returned class can be safely overwritten, without a danger of altering the parent's  `prototype`.

**Example**  - inheriting from  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  and overriding its method

```
const CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();

// This won't alter BaseEditor.prototype.beginEditing()
CustomEditor.prototype.beginEditing = function () {};

```

**Example**  - inheriting from another editor

```
const CustomTextEditor = Handsontable.editors.TextEditor.prototype.extend();

// CustomTextEditor uses all methods implemented by TextEditor.
// You can safely override any method without affecting original TextEditor.

```

**Note:**  This is an utility method not related to the process of editing cell.

#### Editor specific methods

Editor specific methods are methods not implemented in  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/). In order to work, every editor class has to implement those methods.

##### init()

Method called when new instance of editor class is created. That happens at most once per table instance, as all used editors as  **singletons**  within table instance. You should use this methods to perform tasks which results can be reused during editor's lifecycle. The most common operation is creating HTML structure of editor.

Method does not need to return any value.

##### getValue()

Method should act return the current editor value, that is value that should be saved as a new cell value.

#### setValue(newValue:  `Mixed`)

Method should set editor value to  `newValue`.

**Example**  Let's say we are implementing a DateEditor, which helps selecting date, by displaying a calendar.  [`getvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#getvalue)  and  [`setvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#setvalue)  method could work like so:

```
class CalendarEditor extends TextEditor {
  constructor(hotInstance) {
    super(hotInstance);
  }

  getValue() {
    // returns currently selected date, for example "2023/09/15"
    return calendar.getDate();
  }

  setValue(newValue) {
    // highlights given date on calendar
    calendar.highlightDate(newValue);
  }
}

```

##### open()

Displays the editor. In most cases this method can be as simple as:

```
class CustomEditor extends TextEditor {
  open() {
    this.editorDiv.style.display = "";
  }
}

```

This method does not need to return any value.

##### close()

Hides the editor after cell value has been changed. In most cases this method can be as simple as:

```
class CustomEditor extends TextEditor {
  close() {
    this.editorDiv.style.display = "none";
  }
}

```

This method does not need to return any value.

##### focus()

Focuses the editor. This method is called when user wants to close the editor by selecting another cell and the value in editor does not validate (and  [`allowInvalid`](https://handsontable.com/docs/javascript-data-grid/api/options/#allowinvalid)  is  `false`). In most cases this method can be as simple as:

```
class CustomEditor extends TextEditor {
  focus() {
    this.editorInput.focus();
  }
}

```

This method does not need to return any value.

#### Common editor properties

All the undermentioned properties are available in editor instance through  `this`  object (e.g.,  `this.instance`).

Property

Type

Description

instance

`Handsontable.Core`

The instance of Handsontable to which this editor object belongs. Set in class constructor, immutable thorough the whole lifecycle of editor.

row

`Number`

The active cell row index. Updated on every  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method call.

col

`Number`

The active cell col index. Updated on every  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method call.

prop

`String`

The property name associated with active cell (relevant only when data source is an array of objects). Updated on every  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method call.

TD

`HTMLTableCellNode`

Node object of active cell. Updated on every  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method call.

cellProperties

`Object`

An object representing active cell properties. Updated on every  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method call.

### [How to create a custom editor?](https://handsontable.com/docs/javascript-data-grid/cell-editor/#how-to-create-a-custom-editor)

Now you know the philosophy behind the Handsontable editors and you're ready to write your own editor. Basically, you can build a new editor from scratch, by creating a new editor class, which inherits from  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/), or if you just want to enhance an existing editor, you can extend its class and override only a few of its methods.

In this tutorial we will examine both approaches. We will create a completely new  `SelectEditor`  which uses  `<select>`  list to alter the value of cell. We will also create a  `PasswordEditor`  which works exactly like regular  `TextEditor`  except that it displays a password input instead of textarea.

Let's begin with  `PasswordEditor`  as it is a bit easier.

#### `PasswordEditor`  - extending an existing editor

`TextEditor`  is the most complex editor available in Handsontable by default. It displays a  `<textarea>`  which automatically changes its size to accommodate its content. We would like to create a  `PasswordEditor`  which preserves all those capabilities but displays  `<input type="password">`  field instead of  `<textarea>`.

As you may have guessed, we need to create a new editor class, that inherits from  `TextEditor`  and then override some of its methods to replace  `<textarea>`  with  `input:password`. Luckily, textarea and password input have the same API, so all we have to do is replace the code responsible for creating HTML elements. If you take a look at  `TextEditor`  [`init()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#init)  method, you'll notice that it calls internal  `createElements()`  method, which creates  `<textarea>`  node and append it to DOM during editor initialization - BINGO!

Here is the code

```
import Handsontable from "handsontable";

class PasswordEditor extends Handsontable.editors.TextEditor {
  createElements() {
    super.createElements();

    this.TEXTAREA = this.hot.rootDocument.createElement("input");
    this.TEXTAREA.setAttribute("type", "password");
    this.TEXTAREA.setAttribute("data-hot-input", true); // Makes the element recognizable by HOT as its own component's element.
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;

    this.TEXTAREA_PARENT.innerText = "";
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

```

That's it! You can now use your new editor:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  columns: [
    {
      type: "text",
    },
    {
      editor: PasswordEditor,
      // If you want to use string 'password' instead of passing
      // the actual editor class check out section "Registering editor"
    },
  ],
});

```

Let's try something more complex: we'll build a new editor from the ground up.

#### `SelectEditor`  - creating editor from scratch

We're going to build a full featured editor, that lets user choose a cell value from predefined list of options, using standard  `<select>`  input. As an extra feature, we'll add an ability to change currently selected option with  **ARROW_UP**  and  **ARROW_DOWN**  keys.

Things to do:

1.  Create a new class that inherits from  `Handsontable.editors.BaseEditor`.
2.  Add function creating  `<select>`  input and attaching to DOM.
3.  Add function that populates  `<select>`  with options array passed in the cell properties.
4.  Implement methods:
    -   [`getvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#getvalue)
    -   [`setvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#setvalue)
    -   [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)
    -   [`close()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#close)
    -   [`focus()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#focus)
5.  Override the default  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  behaviour, so that pressing  **Arrow Up**  and  **Arrow Down**  keys won't close the editor, but instead change the currently selected value.
6.  Register editor.

##### Create new editor

That's probably the easiest part. All we have to do is call  `BaseEditor.prototype.extend()`  function which will return a new function class that inherits from  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/).

```
const SelectEditor = Handsontable.editors.BaseEditor.prototype.extend();

```

Task one:  **DONE**

##### Create  `<select>`  input and attaching it to DOM

There are three potential places where we can put the function that will create  `<select>`  element and put it in the DOM:

-   [`init()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#init)  method
-   [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method
-   [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  method

The key to choose the best solution is to understand when each of those methods are called.

[`init()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#init)  method is called during creation of editor class object. That happens at most one per table instance, because once the object is created it is reused every time  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  asks for this editor class instance (see  [Singleton pattern (opens new window)](http://en.wikipedia.org/wiki/Singleton_pattern)for details).

[`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method is called every time the user selects a cell that has this particular editor class set as the  [`editor`](https://handsontable.com/docs/javascript-data-grid/api/options/#editor)  configuration option. So, if we set  `SelectEditor`  as editor for an entire column, then selecting any cell in this column will invoke  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method of  `SelectEditor`. In other words, this method can be called hundreds of times during table life, especially when working with large data. Another important aspect of  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  is that it should not display the editor (it's  `open's`  job). Displaying editor is triggered by user event such as pressing ENTER, F2 or double clicking a cell, so there is some time between calling  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  and actually displaying the editor. Nevertheless, operations performed by  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  should be completed as fast as possible, to provide the best user experience.

[`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  method is called when editor needs to be displayed. In most cases this method should change the CSS  `display`  property to  `block`  or perform something similar. User expects that editor will be displayed right after the event (pressing appropriate key or double clicking a cell) has been triggered, so  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  method should work as fast as possible.

Knowing all this, the most reasonable place to put the code responsible for creating  `<select>`  input is somewhere in  [`init()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#init)  method. DOM manipulation is considered to be quite expensive (regarding the resource consumption) operation, so it's best to perform it once and reuse the produced HTML nodes throughout the life of editor.

```
import Handsontable from "handsontable";

class SelectEditor extends Handsontable.editors.BaseEditor {
  /**
   * Initializes editor instance, DOM Element and mount hooks.
   */
  init() {
    // Create detached node, add CSS class and make sure its not visible
    this.select = this.hot.rootDocument.createElement("SELECT");
    this.select.classList.add("htSelectEditor");
    this.select.style.display = "none";

    // Attach node to DOM, by appending it to the container holding the table
    this.hot.rootElement.appendChild(this.select);
  }
}

```

```
.htSelectEditor {
  /*
   * This hack enables to change <select> dimensions in WebKit browsers
   */
  -webkit-appearance: menulist-button !important;
  position: absolute;
  width: auto;
  z-index: 300;
}

```

Task two:  **DONE**

##### Populate  `<select>`  with options

In the previous step we implemented a function that creates the  `<select>`  input and attaches it to the DOM. You probably noticed that we haven't written any code that would create the  `<option>`  elements, therefore if we displayed the list, it would be empty.

We want to be able to define an option list like this:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  columns: [
    {
      editor: SelectEditor,
      selectOptions: ["option1", "option2", "option3"],
    },
  ],
});

```

There is no (easy) way to get to the value of  [`selectOptions`](https://handsontable.com/docs/javascript-data-grid/api/options/#selectoptions). Even if we could get to this array we could only populate the list with options once, if we do this in the 'init' function. What if we have more than one column using  `SelectEditor`  and each of them has it's own option list? It's even possible that two cells in the same column can have different option lists (cascade configuration - remember?) It's clear that we have to find a better place for the code that creates items for our list.

We are left with two places  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  and  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open). The latter one is simpler to implement, but as we previously stated,  [`setvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#setvalue)  should work as fast as possible and creating  `<option>`  nodes and attaching them to DOM might be time consuming, if  [`selectOptions`](https://handsontable.com/docs/javascript-data-grid/api/options/#selectoptions)  contains long list of options. Therefore,  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  seems to be a safer place to do this kind of work. The only thing to keep in mind is that we should always invoke  [`BaseEditor`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)'s original method when overriding  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare).  `BaseEditor.prototype.prepare()`  sets some important properties, which are used by other editor methods.

```
// Create options in prepare() method
prepare(row, col, prop, td, originalValue, cellProperties) {
  // Remember to invoke parent's method
  super.prepare(row, col, prop, td, originalValue, cellProperties);

  const selectOptions = this.cellProperties.selectOptions;
  let options;

  if (typeof selectOptions === 'function') {
    options = this.prepareOptions(selectOptions(this.row, this.col, this.prop));
  } else {
    options = this.prepareOptions(selectOptions);
  }

  this.select.innerText = '';

  Object.keys(options).forEach((key) => {
    const optionElement = this.hot.rootDocument.createElement('OPTION');
    optionElement.value = key;
    optionElement.innerText = options[key];
    this.select.appendChild(optionElement);
  });
}

```

Where the  `prepareOptions`  is:

```
prepareOptions(optionsToPrepare) {
  let preparedOptions = {};

  if (Array.isArray(optionsToPrepare)) {
    for (let i = 0, len = optionsToPrepare.length; i < len; i++) {
      preparedOptions[optionsToPrepare[i]] = optionsToPrepare[i];
    }

  } else if (typeof optionsToPrepare === 'object') {
    preparedOptions = optionsToPrepare;
  }

  return preparedOptions;
}

```

Task three:  **DONE**

##### Implement editor specific methods

Most of the work is done. Now we just need to implement all the editor specific methods. Luckily, our editor is quite simple so those methods will be only few lines of code.

```
getValue() {
  return this.select.value;
}

setValue(value) {
  this.select.value = value;
}

open() {
  const {
    top,
    start,
    width,
    height,
  } = this.getEditedCellRect();
  const selectStyle = this.select.style;

  this._opened = true;

  selectStyle.height = `${height}px`;
  selectStyle.minWidth = `${width}px`;
  selectStyle.top = `${top}px`;
  selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
  selectStyle.margin = '0px';
  selectStyle.display = '';
}

focus() {
  this.select.focus();
}

close() {
  this._opened = false;
  this.select.style.display = 'none';
}

```

The implementations of  [`getvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#getvalue),  [`setvalue()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#setvalue)  and  [`close()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#close)  are self-explanatory, but  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  requires a few words of comment. First of all, the implementation assumes that code responsible for populating the list with options is placed in  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare). Secondly, before displaying the list, we sets its  `height`  and  `min-width`  so that it matches the size of corresponding cell. It's an optional step, but without it the editor will have different sizes depending on the browser. Probably a good idea would be also to limit the maximum height of  `<select>`. Finally, as the  `<select>`  has been appended to the end of the table container, we have to change its position so that it could be displayed above the cell that is being edited. Again, this is an optional step, but it seems quite reasonable to put the editor next to the appropriate cell.

Task four:  **DONE**

At this point we should have an editor that is ready to use. Put the code somewhere in your page and pass  `SelectEditor`  class function as value of the  [`editor`](https://handsontable.com/docs/javascript-data-grid/api/options/#editor)  configuration option.

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  columns: [
    {},
    {
      editor: SelectEditor,
      selectOptions: ["option1", "option2", "option3"],
    },
  ],
});

```

##### Use  **Arrow Up**  and  **Arrow Down**  to change selected value

We know that our editor works, but let's add one more tweak to it. Currently, when editor is opened and user presses  **Arrow Up**  or  **Arrow Down**  editor closes and the selection moves one cell up or down. Wouldn't it be nice, if pressing up and down arrow keys changed the currently selected value? User could navigate to the cell, hit  **Enter**, choose the desired value and save changes by hitting  **Enter**  again. It would be possible to work with the table without even laying your hand on a mouse. Sounds pretty good, but how to override the default behavior? After all, it's the  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  who decides when to close the editor.

Don't worry. Although, you don't have a direct access to  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  instance, you can still override its behaviour. Before  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  starts to process keyboard events it triggers  [`beforeKeyDown`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforekeydown)  hook. If any of the listening functions invoke  `stopImmediatePropagation()`  method on an  `event`  object  [`EditorManager`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/)  won't process this event any further. Therefore, all we have to do is register a  [`beforeKeyDown`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforekeydown)  listener function that checks whether  **Arrow Up**  or  **Arrow Down**  has been pressed and if so, stops event propagation and changes the currently selected value in  `<select>`  list accordingly.

The thing that we need to keep in mind is that our listener should work only, when our editor is opened. We want to preserve the default behaviour for other editors, as well as when no editor is opened. That's why the most reasonable place to register our listener would be the  [`open()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#open)  method and the  [`close()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#close)  method should contain code that will remove our listener.

Here's how the listener function could look like:

```
onBeforeKeyDown() {
  const previousOptionIndex = this.select.selectedIndex - 1;
  const nextOptionIndex = this.select.selectedIndex + 1;

  switch (event.keyCode) {
    case 38: // Arrow Up
      if (previousOptionIndex >= 0) {
        this.select[previousOptionIndex].selected = true;
      }

      event.stopImmediatePropagation();
      event.preventDefault();
      break;

    case 40: // Arrow Down
      if (nextOptionIndex <= this.select.length - 1){
        this.select[nextOptionIndex].selected=true;
      }

      event.stopImmediatePropagation();
      event.preventDefault();
      break;

    default:
      break;
  }
}

```

Active editor is the editor which  [`prepare()`](https://handsontable.com/docs/javascript-data-grid/api/base-editor/#prepare)  method was called most recently. For example, if you select a cell which editor is  `Handsontable.TextEditor`, then  `getActiveEditor()`  will return an object of this editor class. If then select a cell (presumably in another column) which editor is  `Handsontable.DateEditor`, the active editor changes and now  `getActiveEditor()`  will return an object of  `DateEditor`  class.

The rest of the code should be quite clear. Now all we have to do is register our listener.

```
open() {
  this.addHook('beforeKeyDown', () => this.onBeforeKeyDown());
}

close() {
  this.clearHooks();
}

```

Go ahead and test it!

## [Registering an editor](https://handsontable.com/docs/javascript-data-grid/cell-editor/#registering-an-editor)

When you create an editor, a good idea is to assign it an alias that will refer to this particular editor class. Handsontable defines 11 aliases by default:

-   `autocomplete`  for  `Handsontable.editors.AutocompleteEditor`
-   `base`  for  `Handsontable.editors.BaseEditor`
-   `checkbox`  for  `Handsontable.editors.CheckboxEditor`
-   `date`  for  `Handsontable.editors.DateEditor`
-   `dropdown`  for  `Handsontable.editors.DropdownEditor`
-   `handsontable`  for  `Handsontable.editors.HandsontableEditor`
-   `numeric`  for  `Handsontable.editors.NumericEditor`
-   `password`  for  `Handsontable.editors.PasswordEditor`
-   `select`  for  `Handsontable.editors.SelectEditor`
-   `text`  for  `Handsontable.editors.TextEditor`
-   `time`  for  `Handsontable.editors.TimeEditor`

It gives users a convenient way for defining which editor should be use when changing value of certain cells. User doesn't need to know which class is responsible for displaying the editor, he does not even need to know that there is any class at all. What is more, you can change the class associated with an alias without a need to change code that defines a table.

To register your own alias use  `Handsontable.editors.registerEditor()`  function. It takes two arguments:

-   `editorName`  - a string representing an editor
-   `editorClass`  - a class that will be represented by  `editorName`

If you'd like to register  `SelectEditor`  under alias  `select`  you have to call:

```
Handsontable.editors.registerEditor("select", SelectEditor);

```

Choose aliases wisely. If you register your editor under name that is already registered, the target class will be overwritten:

```
Handsontable.editors.registerEditor("text", MyNewTextEditor);

```

Now 'text' alias points to MyNewTextEditor class, not  `Handsontable.editors.TextEditor`.

So, unless you intentionally want to overwrite an existing alias, try to choose a unique name. A good practice is prefixing your aliases with some custom name (for example your GitHub username) to minimize the possibility of name collisions. This is especially important if you want to publish your editor, because you never know aliases has been registered by the user who uses your editor.

```
Handsontable.editors.registerEditor("select", SelectEditor);

```

Someone might already registered such alias.

```
Handsontable.editors.registerEditor("my.select", SelectEditor);

```

That's better.

## [Prepare editor for publication](https://handsontable.com/docs/javascript-data-grid/cell-editor/#prepare-editor-for-publication)

If you plan to publish your editor or just want to keep your code nice and clean (as we all do 😃 there are 3 simple steps that will help you to organize your code.

### [Enclose in IIFE](https://handsontable.com/docs/javascript-data-grid/cell-editor/#enclose-in-iife)

Put your code in a module, to avoid polluting the global namespace. You can use AMD, CommonJS or any other module pattern, but the easiest way to isolate your code is to use plain immediately invoked function expression (IIFE).

```
((Handsontable) => {
  const CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();

  // ...rest of the editor code
})(Handsontable);

```

Passing  `Handsontable`  namespace as argument is optional (as it is defined globally), but it's a good practice to use as few global objects as possible, to make modularisation and dependency management easier.

### [Add editor to dedicated namespace](https://handsontable.com/docs/javascript-data-grid/cell-editor/#add-editor-to-dedicated-namespace)

Code enclosed in IIFE cannot be accessed from outside, unless it's intentionally exposed. To keep things well organized register your editor to the collection of editors using  `Handsontable.editors.registerEditor`  method. This way you can use your editor during table definition and other users will have an easy access to your editor, in case they would like to extend it.

```
((Handsontable) => {
  const CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();

  // ...rest of the editor code

  // And at the end
  Handsontable.editors.registerEditor("custom", CustomEditor);
})(Handsontable);

```

From now on, you can use  `CustomEditor`  like so:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  columns: [
    {
      editor: Handsontable.editors.CustomEditor,
    },
  ],
});

```

Extending your  `CustomEditor`  is also easy.

```
const AnotherEditor = Handsontable.editors
  .getEditor("custom")
  .prototype.extend();

```

Keep in mind, that there are no restrictions to the name you choose, but choose wisely and do not overwrite existing editors. Try to keep the names unique.

### [Register an alias](https://handsontable.com/docs/javascript-data-grid/cell-editor/#register-an-alias)

The final touch is to register your editor under some alias, so that users can easily refer to it without the need to now the actual class name. See Registering editor for details.

To sum up, a well prepared editor should look like this:

```
((Handsontable) => {
  const CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();

  // ...rest of the editor code

  // Put editor in dedicated namespace
  Handsontable.editors.CustomEditor = CustomEditor;

  // Register alias
  Handsontable.editors.registerEditor("theBestEditor", CustomEditor);
})(Handsontable);

```

From now on, you can use  `CustomEditor`  like so:

```
const container = document.querySelector("#container");
const hot = new Handsontable(container, {
  columns: [
    {
      editor: "theBestEditor",
    },
  ],
});

```

# [Cell validator](https://handsontable.com/docs/javascript-data-grid/cell-validator/#cell-validator)

Validate data added or changed by the user, with predefined or custom rules. Validation helps you make sure that the data matches the expected format.

On this page

-   [Overview](https://handsontable.com/docs/javascript-data-grid/cell-validator/#overview)
-   [Register custom cell validator](https://handsontable.com/docs/javascript-data-grid/cell-validator/#register-custom-cell-validator)
-   [Using an alias](https://handsontable.com/docs/javascript-data-grid/cell-validator/#using-an-alias)
-   [Full featured example](https://handsontable.com/docs/javascript-data-grid/cell-validator/#full-featured-example)
-   [Related API reference](https://handsontable.com/docs/javascript-data-grid/cell-validator/#related-api-reference)

## [Overview](https://handsontable.com/docs/javascript-data-grid/cell-validator/#overview)

When you create a validator, a good idea is to assign it as an alias that will refer to this particular validator function. Handsontable defines 5 aliases by default:

-   `autocomplete`  for  `Handsontable.validators.AutocompleteValidator`
-   `date`  for  `Handsontable.validators.DateValidator`
-   `dropdown`  for  `Handsontable.validators.DropdownValidator`
-   `numeric`  for  `Handsontable.validators.NumericValidator`
-   `time`  for  `Handsontable.validators.TimeValidator`

It gives users a convenient way for defining which validator should be used when table validation was triggered. User doesn't need to know which validator function is responsible for checking the cell value, he does not even need to know that there is any function at all. What is more, you can change the validator function associated with an alias without a need to change code that defines a table.

## [Register custom cell validator](https://handsontable.com/docs/javascript-data-grid/cell-validator/#register-custom-cell-validator)

To register your own alias use  `Handsontable.validators.registerValidator()`  function. It takes two arguments:

-   `validatorName`  - a string representing a validator function
-   `validator`  - a validator function that will be represented by  `validatorName`

If you'd like to register  `creditCardValidator`  under alias  `credit-card`  you have to call:

```
Handsontable.validators.registerValidator('credit-card', creditCardValidator);

```

Choose aliases wisely. If you register your validator under name that is already registered, the target function will be overwritten:

```
Handsontable.validators.registerValidator('date', creditCardValidator);

```

Now 'date' alias points to  `creditCardValidator`  function, not  `Handsontable.validators.DateValidator`.

So, unless you intentionally want to overwrite an existing alias, try to choose a unique name. A good practice is prefixing your aliases with some custom name (for example your GitHub username) to minimize the possibility of name collisions. This is especially important if you want to publish your validator, because you never know aliases has been registered by the user who uses your validator.

```
Handsontable.validators.registerValidator('credit-card', creditCardValidator);

```

Someone might already registered such alias.

```
Handsontable.validators.registerValidator('my.credit-card', creditCardValidator);

```

That's better.

## [Using an alias](https://handsontable.com/docs/javascript-data-grid/cell-validator/#using-an-alias)

The final touch is to use the registered aliases, so that users can easily refer to it without the need to now the actual validator function is.

To sum up, a well prepared validator function should look like this:

```
(Handsontable => {
  function customValidator(query, callback) {
    // ...your custom logic of the validator

    callback(/* Pass `true` or `false` based on your logic */);
  }

  // Register an alias
  Handsontable.validators.registerValidator('my.custom', customValidator);

})(Handsontable);

```

From now on, you can use  `customValidator`  like so:

```
const container = document.querySelector('#container')
const hot = new Handsontable(container, {
  columns: [{
    validator: 'my.custom'
  }]
});

```

## [Full featured example](https://handsontable.com/docs/javascript-data-grid/cell-validator/#full-featured-example)

Use the validator method to easily validate synchronous or asynchronous changes to a cell. If you need more control,  [`beforeValidate`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforevalidate)  and  [`afterValidate`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#aftervalidate)  hooks are available. In the below example,  `email_validator_fn`  is an async validator that resolves after 1000 ms.

Use the  [`allowInvalid`](https://handsontable.com/docs/javascript-data-grid/api/options/#allowinvalid)  option to define if the grid should accept input that does not validate. If you need to modify the input (e.g., censor bad words, uppercase first letter), use the plugin hook  [`beforeChange`](https://handsontable.com/docs/javascript-data-grid/api/hooks/#beforechange).

By default, all invalid cells are marked by  `htInvalid`  CSS class. If you want to change class to another you can basically add the  `invalidCellClassName`  option to Handsontable settings. For example:

For the entire table

```
invalidCellClassName: 'myInvalidClass'

```

For specific columns

```
columns: [
  { data: 'firstName', invalidCellClassName: 'myInvalidClass' },
  { data: 'lastName', invalidCellClassName: 'myInvalidSecondClass' },
  { data: 'address' }
]
```
```
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

// Register all Handsontable's modules.
registerAllModules();

const container = document.querySelector('#example1');
const output = document.querySelector('#output');
const ipValidatorRegexp =
  /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;

const emailValidator = (value, callback) => {
  setTimeout(() => {
    if (/.+@.+/.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  }, 1000);
};

new Handsontable(container, {
  themeName: 'ht-theme-main',
  data: [
    {
      id: 1,
      name: { first: 'Joe', last: 'Fabiano' },
      ip: '0.0.0.1',
      email: 'Joe.Fabiano@ex.com',
    },
    {
      id: 2,
      name: { first: 'Fred', last: 'Wecler' },
      ip: '0.0.0.1',
      email: 'Fred.Wecler@ex.com',
    },
    {
      id: 3,
      name: { first: 'Steve', last: 'Wilson' },
      ip: '0.0.0.1',
      email: 'Steve.Wilson@ex.com',
    },
    {
      id: 4,
      name: { first: 'Maria', last: 'Fernandez' },
      ip: '0.0.0.1',
      email: 'M.Fernandez@ex.com',
    },
    {
      id: 5,
      name: { first: 'Pierre', last: 'Barbault' },
      ip: '0.0.0.1',
      email: 'Pierre.Barbault@ex.com',
    },
    {
      id: 6,
      name: { first: 'Nancy', last: 'Moore' },
      ip: '0.0.0.1',
      email: 'Nancy.Moore@ex.com',
    },
    {
      id: 7,
      name: { first: 'Barbara', last: 'MacDonald' },
      ip: '0.0.0.1',
      email: 'B.MacDonald@ex.com',
    },
    {
      id: 8,
      name: { first: 'Wilma', last: 'Williams' },
      ip: '0.0.0.1',
      email: 'Wilma.Williams@ex.com',
    },
    {
      id: 9,
      name: { first: 'Sasha', last: 'Silver' },
      ip: '0.0.0.1',
      email: 'Sasha.Silver@ex.com',
    },
    {
      id: 10,
      name: { first: 'Don', last: 'Pérignon' },
      ip: '0.0.0.1',
      email: 'Don.Pérignon@ex.com',
    },
    {
      id: 11,
      name: { first: 'Aaron', last: 'Kinley' },
      ip: '0.0.0.1',
      email: 'Aaron.Kinley@ex.com',
    },
  ],
  beforeChange(changes) {
    for (let i = changes.length - 1; i >= 0; i--) {
      const currChange = changes[i];

      if (!currChange) {
        return false;
      }

      // gently don't accept the word "foo" (remove the change at index i)
      if (currChange[3] === 'foo') {
        changes.splice(i, 1);
      }
      // if any of pasted cells contains the word "nuke", reject the whole paste
      else if (currChange[3] === 'nuke') {
        return false;
      }
      // capitalise first letter in column 1 and 2
      else if (currChange[1] === 'name.first' || currChange[1] === 'name.last') {
        if (currChange[3] !== null) {
          changes[i][3] = currChange[3].charAt(0).toUpperCase() + currChange[3].slice(1);
        }
      }
    }

    return true;
  },
  afterChange(changes, source) {
    if (source !== 'loadData') {
      output.innerText = JSON.stringify(changes);
    }
  },
  colHeaders: ['ID', 'First name', 'Last name', 'IP', 'E-mail'],
  height: 'auto',
  licenseKey: 'non-commercial-and-evaluation',
  columns: [
    { data: 'id', type: 'numeric' },
    { data: 'name.first' },
    { data: 'name.last' },
    { data: 'ip', validator: ipValidatorRegexp, allowInvalid: true },
    { data: 'email', validator: emailValidator, allowInvalid: false },
  ],
  autoWrapRow: true,
  autoWrapCol: true,
});
```

Edit the above grid to see the  `changes`  argument from the callback.

Mind that changes in table are applied after running all validators (both synchronous and and asynchronous) from every changed cell.