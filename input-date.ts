import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorFactory, rendererFactory } from "./src/factories";
import { format } from "date-fns";

registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerText = format(new Date(value), "MM/dd/yyyy");
    return td;
  }),          
  // TODO after changing value next cell should be selected 
  // but native input somehow blocks this
  editor: editorFactory<{input: HTMLInputElement}>({
    init : (editor) => {
      editor.input = document.createElement("INPUT") as HTMLInputElement;      
      editor.input.setAttribute('type', 'date');
      editor.input.addEventListener('keyup', () => {
        // This fires when picker is closed without selecting a date
        editor.close();
      });
      editor.input.addEventListener('change', () => {
        editor.finishEditing();
      });
      editor.value = editor.input.value;
    }, 
    afterOpen:(editor) => {
      editor.input.showPicker();
    },     
  })

};


new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Restock Date",
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
      data: "restockDate",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});
