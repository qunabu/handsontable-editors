import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorFactory, rendererFactory } from "./src/factories";


// Register all available Handsontable modules
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  // renderer: rendererFactory(({ td, value }) => {
  //   //td.innerText = format(new Date(value), "MM/dd/yyyy");
  //   td.innerHTML = value;
  //   return td;
  // }),
  // validator: (value, callback) => {    
  //   value = parseInt(value);
  //   callback(true)
  // },
  editor: editorFactory<{input: HTMLDivElement, value: string, config: string[]}>({
    config: ['👍', '👎', '🤷‍♂️'],
    value: '👍',
    shortcuts: [
      {
        keys: [['ArrowRight']],
        callback: (editor, _event) => {
          let index = editor.config.indexOf(editor.value);
          index = index === editor.config.length - 1 ? 0 : index + 1;
          editor.setValue(editor.config[index]);  
        }
      }, 
      {
        keys: [['ArrowLeft']],
        callback: (editor, _event) => {
          let index = editor.config.indexOf(editor.value);
          index = index === 0 ? editor.config.length - 1 : index - 1;
          editor.setValue(editor.config[index]);        
        }
      }
    ],
    render: (editor) => {
      editor.input.innerHTML = editor.config.map((option) => `<button style="width:33%; ${editor.value === option ? 'background: #007bff; color: white;' : ''}">${option}</button>`).join('');
    },
    init : (editor) => {
      editor.input = document.createElement("DIV") as HTMLDivElement;      
      editor.input.style = 'display: flex; gap: 4px;  padding: 5px; background:#eee; border: 1px solid #ccc; border-radius: 4px;';
      editor.input.addEventListener('click', (event) => {
        if (event.target instanceof HTMLButtonElement) {
          editor.setValue( event.target.innerText);
          editor.finishEditing();
        }
      });
      editor.render(editor);
    }, 
    beforeOpen:(editor, { originalValue }) => {
      editor.setValue( originalValue);
    },
    // afterOpen:(editor) => {
    //   editor.render(editor);      
    // }, 
  })

};


new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Feedback",
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
      data: "feedback",
      width: 150,
      ...cellDefinition,
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});
