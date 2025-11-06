import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data } from "./src/data";
import { editorBaseFactory, rendererFactory, editorFactory } from "./src/factories";
import { format } from "date-fns";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Register all available Handsontable modules
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const DATE_FORMAT_US = "MM/dd/yyyy";
const DATE_FORMAT_EU = "dd/MM/yyyy";


const cellDefinition = {
  renderer: rendererFactory(({ td, value, cellProperties }) => {
    td.innerText = format(new Date(value), cellProperties.renderFormat);
    return td;
  }),

  editor: editorFactory<{wrapper: HTMLDivElement, input: HTMLInputElement, flatpickr: flatpickr.Instance, eventManager: Handsontable.EventManager, flatpickrSettings: flatpickr.Options.Options}>({
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.input = editor.hot.rootDocument.createElement("INPUT") as HTMLInputElement;        
      editor.flatpickr = flatpickr(editor.input, {
        dateFormat: "Y-m-d",
        enableTime: false,
        onChange: () => {
          editor.finishEditing();
        },
      });
      /**
       * Prevent recognizing clicking on datepicker as clicking outside of table.
       */
      editor.eventManager = new Handsontable.EventManager(editor.wrapper);
      editor.eventManager.addEventListener(document.body, 'mousedown', (event) => {             
        if ( editor.flatpickr.calendarContainer.contains(event.target as Node)) {
          event.stopPropagation();
        }        
      });
    },
    afterClose(editor) {
      console.log('afterClose');
    },
    beforeOpen(editor, { originalValue, cellProperties }) {
      editor.setValue(originalValue);
      for (const key in cellProperties.flatpickrSettings) {
        editor.flatpickr.set(key as keyof flatpickr.Options.Options, cellProperties.flatpickrSettings[key]);
      }      
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
      editor.flatpickr.setDate(new Date(value));
    },
  }),
};

const hot = new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Restock Date UE",
    "Restock Date US",
    'Custom Editor',
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
      renderFormat: DATE_FORMAT_EU,
      flatpickrSettings: {
        locale: {
          firstDayOfWeek: 1
        }
      },      
    },
    {
      data: "restockDate",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
      renderFormat: DATE_FORMAT_US,
      flatpickrSettings: {
        locale: {
          firstDayOfWeek: 0 
        }
      },    
    }
  ],
  licenseKey: "non-commercial-and-evaluation",
});