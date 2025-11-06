import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorBaseFactory, rendererFactory, editorFactory } from "./src/factories";

//import "./src/libs/multiselect.ts";

// Register all available Handsontable modules
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerHTML = Array.from({ length: 5 }, (_, index) => `<span style="opacity: ${index < value ? '1' : '0.4'}">⭐</span>`).join('');
    return td;
  }),
  validator: (value, callback) => {    
    value = parseInt(value);
    callback(value >= 0 && value <= 100);
  },
  
  editor: editorFactory<{ input: HTMLDivElement}>({
    shortcuts: [
      {
        keys: [['1'], ['2'], ['3'], ['4'], ['5']],
        callback: (editor, _event) => {
          editor.setValue( (_event as KeyboardEvent).key);           
        }
      }, 
      {
        keys: [['ArrowRight']],
        callback: (editor, _event) => {
          if (parseInt(editor.value) < 5) {
            editor.setValue( parseInt(editor.value) + 1);  
          } 
        }
      }, 
      {
        keys: [['ArrowLeft']],
        callback: (editor, _event) => {
          if (parseInt(editor.value) > 1) {
            editor.setValue( parseInt(editor.value) - 1);  
          }  
        }
      }
    ],
    init(editor) {
      editor.input = editor.hot.rootDocument.createElement("DIV") as HTMLDivElement;      
      editor.input.style = 'background: #eee; padding: 4px 5px; cursor: pointer; border-radius: 4px; font-size: 16px;';     
    },
    afterInit(editor) {
      editor.input.addEventListener('mouseover', (event) => {
        if (event.target instanceof HTMLSpanElement && event.target.dataset.value && parseInt(editor.value) !== parseInt(event.target.dataset.value)) {
          editor.setValue(event.target.dataset.value);
        }
      });
      editor.input.addEventListener('mousedown', () => {
        editor.finishEditing();
      })
    },
    render(editor) {
      editor.input.innerHTML = Array.from({ length: 5 }, (_, index) => `<span data-value="${index + 1}" style="opacity: ${index < editor.value ? '1' : '0.4'}">⭐</span>`).join('');
    },
    
  }),
};


new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Rating",
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
      data: "stars",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});
