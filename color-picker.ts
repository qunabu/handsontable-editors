import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorBaseFactory, rendererFactory } from "./src/factories";
// Register all available Handsontable modules
registerAllModules();

import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
Coloris.init();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.style.backgroundColor = `${value}`;
    td.innerHTML = `<b>${value}</b>`;
    return td;
  }),
  validator: (value, callback) => {
    callback(value.length === 7 && value[0] == '#'); // validate color format
  },
  editor: editorBaseFactory({
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.input = editor.hot.rootDocument.createElement("INPUT");
      editor.input.classList.add("htSelectEditor");
      editor.input.setAttribute('data-coloris', '');
      editor.input.style.display = "none";
      editor.hot.rootElement.appendChild(editor.input);
      Coloris({closeButton:true, closeLabel:"Apply Colour"});
      editor.input.addEventListener('close', (event) => {
        editor.finishEditing(); // close the color picker and save value on pressing "Apply Colour"
      });
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
    },
    open(editor) {
      const rect = editor.getEditedCellRect();
      editor.input.style = `display: block; border:none; padding:0; position: absolute; top: ${rect.top}px; left: ${rect.start}px; width: ${rect.width}px; height: ${rect.height}px;`;
      editor.input.click(); // open the color picker
    },
    focus(editor) {
      editor.input.focus();
    },
    close(editor) {
      editor.input.style.display = 'none';
    }
  }),
};


new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Color",
  ],
  rowHeaders: true,
  columns: [
    { data: "id", type: "numeric", width: 150 },
    {
      data: "itemName",
      type: "text",
      width: 150,
    },
    {
      data: "color",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});
