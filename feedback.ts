import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorFactory, rendererFactory } from "./src/factories";

// import { baseRenderer } from "handsontable/renderers";

// console.log(baseRenderer);


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
    // onKeyDown: (editor, event) => {
    //   if (event.key === 'Tab') {
    //   let index = editor.config.indexOf(editor.value);
    //         index = index === editor.config.length - 1 ? 0 : index + 1;
    //     editor.setValue(editor.config[index]);
    //     return false;
    //   }
    //   return true;
    // },
    shortcuts: [
      {
        keys: [['ArrowRight'], ['Tab']],
        callback: (editor, _event) => {          
          let index = editor.config.indexOf(editor.value);
          index = index === editor.config.length - 1 ? 0 : index + 1;
          editor.setValue(editor.config[index]);    
          return false;
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
  })

};


// const data: (string | number)[][] = [
//   ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
//   ['2017', 10, 11, 12, 13, 15, 16],
//   ['2018', 10, 11, 12, 13, 15, 16],
//   ['2019', 10, 11, 12, 13, 15, 16],
//   ['2020', 10, 11, 12, 13, 15, 16],
//   ['2021', 10, 11, 12, 13, 15, 16],
// ];
// Define configuration options for the Handsontable
const hotOptions: Handsontable.GridSettings = {
  themeName: 'ht-theme-main',
  data,
  colHeaders: ['ID', 'Item Name', 'Item feedback'],
  autoRowSize: true,
  rowHeaders: true,
  autoWrapRow: true,
  height: 'auto',
  columns: [
    { data: 'id', type: 'numeric' },
    {
      data: 'itemName',
      type: 'text',
    },
    {
      data: 'feedback',
      width: 150,
      ...cellDefinition,
    },
  ],
  licenseKey: 'non-commercial-and-evaluation',
};

// Initialize the Handsontable instance with the specified configuration options
// eslint-disable-next-line no-unused-vars
const hot = new Handsontable(container, hotOptions);