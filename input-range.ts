import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorBaseFactory, rendererFactory } from "./src/factories";

//import "./src/libs/multiselect.ts";

// Register all available Handsontable modules
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerHTML = `<div><input style="pointer-events: none; width: 100%; padding: 0;" disabled readonly type="range" value="${value}" /></div>`;
    return td;
  }),
  validator: (value, callback) => {    
    value = parseInt(value);
    callback(value >= 0 && value <= 100);
  },
  editor: editorBaseFactory<{wrapper: HTMLDivElement, input: HTMLInputElement}>({
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.wrapper = editor.hot.rootDocument.createElement("DIV") as HTMLDivElement;
      editor.wrapper.style.display = "none";
      editor.wrapper.classList.add("htSelectEditor");
      editor.input = editor.hot.rootDocument.createElement("INPUT") as HTMLInputElement;      
      editor.input.setAttribute('type', 'range');
      editor.input.setAttribute('min', '0');
      editor.input.setAttribute('max', '100');
      editor.input.setAttribute('step', '1');
      editor.input.style = 'width: 100%; padding: 0;';
      editor.wrapper.appendChild(editor.input);
      editor.hot.rootElement.appendChild(editor.wrapper);
      editor.input.addEventListener('input', (event) => {
        if (editor.TD) {
          editor.TD.querySelector('input')!.value = (event.target as HTMLInputElement).value;
        }
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
      editor.wrapper.style = `display: block; border:none; box-sizing: border-box; margin:0; padding:0 4px; position: absolute; top: ${rect.top}px; left: ${rect.start}px; width: ${rect.width}px; height: ${rect.height}px;`;
    },
    focus(editor) {
      editor.input.focus();
    },
    close(editor) {
      editor.wrapper.style.display = 'none';
    }
  }),
};


new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Completed percentage",
  ],
  autoRowSize: true,
  rowHeaders: true,
  columns: [
    { data: "id", type: "numeric", width: 150 },
    {
      data: "itemName",
      type: "text",
      width: 150,
    },
    {
      data: "completed",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});
