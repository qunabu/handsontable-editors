import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorFactory, rendererFactory } from "./src/factories";
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
  editor: editorFactory<{input: HTMLInputElement}>({
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.input = editor.hot.rootDocument.createElement("INPUT") as HTMLInputElement;
      editor.input.setAttribute('data-coloris', '');
    },
    afterInit(editor) {
      Coloris({el: editor.input, closeButton:true, closeLabel:"Apply Colour",  alpha: false, wrap: false});
      editor.input.addEventListener('close', (event) => {
        editor.finishEditing(); // close the color picker and save value on pressing "Apply Colour"
      });
    },
    afterOpen(editor) {
      editor.input.click();
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
    },
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
