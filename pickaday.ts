import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { data as originalData } from "./src/data";
import {
  editorFactory,
  rendererFactory,
} from "./src/factories";
import moment from "moment";
import Pikaday from "@handsontable/pikaday";

// Register all available Handsontable modules
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const DATE_FORMAT_US = "MM/DD/YYYY";
const DEFAULT_DATE_FORMAT = DATE_FORMAT_US;

const data = originalData.map(item => ({
  ...item,
  restockDate: moment(new Date(item.restockDate)).format(DATE_FORMAT_US),
}));

const copyStyleFromElements = (source: HTMLElement, target: HTMLElement, keys: string[] = [], keysStartsWith: string[] = [] ) => {
  const computedStyle = getComputedStyle(source);
  Array.from(computedStyle)     
  .filter(key => {
    if (keys.length === 0 && keysStartsWith.length === 0) {
      return true;
    }
    if (keys.length > 0) {
      if ( keys.includes(key)) {
        return true;
      };
    }
    if (keysStartsWith.length > 0) {
      if ( keysStartsWith.some(startsWith => key.startsWith(startsWith))) {
        return true;
      }
    }
    return false;
  }).forEach(key => target.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
}

const cellDefinition = {
  renderer: rendererFactory(({ td, value, cellProperties }) => {
    td.innerText = moment(new Date(value), cellProperties.renderFormat).format(cellProperties.renderFormat);
    return td;
  }),

  editor: editorFactory<
    {
      input: HTMLInputElement;
      pickaday: Pikaday;
      eventManager: Handsontable.EventManager;
      showDatepicker: (editor: ReturnType<typeof editorFactory>, event: Event | undefined) => void;
      hideDatepicker: (editor: ReturnType<typeof editorFactory>) => void;
        void;
      datePicker: HTMLDivElement;
    }
  >({
    position: "portal",
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.input = editor.hot.rootDocument.createElement(
        "INPUT",
      ) as HTMLInputElement;

      editor.datePicker = editor.container;

      /**
       * Prevent recognizing clicking on datepicker as clicking outside of table.
       */
      editor.eventManager = new Handsontable.EventManager(editor.container);
      editor.eventManager.addEventListener(document.body, 'mousedown', (event) => {             
        if (event.target && (event.target as HTMLElement).classList.contains( 'pika-day')) {
          editor.hideDatepicker(editor);
        }     
      });

    },
    getDatePickerConfig(editor): Pikaday.PikadayOptions {
      const htInput = editor.input;
      const options: Pikaday.PikadayOptions = {};
  
      if (editor.cellProperties && editor.cellProperties.datePickerConfig) {
        Object.assign(options, editor.cellProperties.datePickerConfig);
      }
      const origOnSelect = options.onSelect;
      const origOnClose = options.onClose;
  
      options.field = htInput;
      options.trigger = htInput;
      options.container = editor.datePicker;
      options.bound = false;
      options.keyboardInput = false;
      options.format = options.format ?? editor.getDateFormat(editor);
      options.reposition = options.reposition || false;
      // Set the RTL to `false`. Due to the https://github.com/Pikaday/Pikaday/issues/647 bug, the layout direction
      // of the date picker is controlled by juggling the "dir" attribute of the root date picker element.
      // See line @64 of this file.
      options.isRTL = false;
      options.onSelect = (date) => {
       
        let dateStr;
  
        if (!isNaN(date.getTime())) {
          dateStr = moment(date).format(editor.getDateFormat(editor));
        }
        editor.setValue(dateStr);
  
        if (origOnSelect) {
          origOnSelect.call(editor.pickaday);
        }
  
        if (Handsontable.helper.isMobileBrowser()) {
          editor.hideDatepicker(editor);
        }
      };
      options.onClose = () => {
        if (!editor.parentDestroyed) {
          editor.finishEditing(false);
        }
        if (origOnClose) {
          origOnClose();
        }
      };
  
      return options;
    },
    hideDatepicker(editor) {
      editor.pickaday.hide();
    },
    showDatepicker(editor, event) {
      const dateFormat = editor.getDateFormat(editor);
      const isMouseDown = editor.hot.view.isMouseDown();
      const isMeta = event
        ? Handsontable.helper.isFunctionKey(event.keyCode)
        : false;
      let dateStr;

      editor.pickaday = new Pikaday(editor.getDatePickerConfig(editor));

      if (typeof editor.pickaday.useMoment === "function") {
        editor.pickaday.useMoment(moment);
      }

      editor.pickaday._onInputFocus = function () {};

      if (editor.originalValue) {
        dateStr = editor.originalValue;

        if (moment(dateStr, dateFormat, true).isValid()) {
          editor.pickaday.setMoment(moment(dateStr, dateFormat), true);
        }

        // workaround for date/time cells - pikaday resets the cell value to 12:00 AM by default, this will overwrite the value.
        if (editor.getValue() !== editor.originalValue) {
          editor.setValue(editor.originalValue);
        }

        if (!isMeta && !isMouseDown) {
          editor.setValue("");
        }
      } else if (editor.cellProperties.defaultDate) {
        dateStr = editor.cellProperties.defaultDate;

        if (moment(dateStr, dateFormat, true).isValid()) {
          editor.pickaday.setMoment(moment(dateStr, dateFormat), true);
        }

        if (!isMeta && !isMouseDown) {
          editor.setValue("");
        }
      } else {
        // if a default date is not defined, set a soft-default-date: display the current day and month in the
        // datepicker, but don't fill the editor input
        editor.pickaday.gotoToday();
      }

    },
    afterClose(editor) {
      if (editor.pickaday.destroy) {
        editor.pickaday.destroy();
      }
    },
    afterOpen(editor, event) {
      copyStyleFromElements(editor.TD, editor.input, 
        ['width', 'height', 'background', 'font-family', 'font-size', 'font-weight', 'line-height', 'color','box-sizing'], 
        ['border-', 'padding-', 'margin-'])
      editor.showDatepicker(editor, event);
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
    },
    getDateFormat(editor) {
      return editor.cellProperties.dateFormat ?? DEFAULT_DATE_FORMAT;
    },
    shortcuts: [{
      keys: [['ArrowLeft']],
      callback: (editor, _event) => {
        //@ts-ignore
        editor.pickaday.adjustDate('subtract', 1);
        _event.preventDefault();
      },
    }, {
      keys: [['ArrowRight']],
      callback: (editor, _event) => {
        //@ts-ignore
        editor.pickaday.adjustDate('add', 1);
        _event.preventDefault();
      },
    }, {
      keys: [['ArrowUp']],
      callback: (editor, _event) => {
        //@ts-ignore
        editor.pickaday.adjustDate('subtract', 7);
        _event.preventDefault();
      },
    }, {
      keys: [['ArrowDown']],
      callback: (editor, _event) => {
        //@ts-ignore
        editor.pickaday.adjustDate('add', 7);
        _event.preventDefault();
      },
    }]
  }),
};

const hot = new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Restock Date UE",
    "Restock Date US",
    "Custom Editor",
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
      renderFormat: DATE_FORMAT_US,
      dateFormat: DATE_FORMAT_US,
      correctFormat: true,
      defaultDate: '01/01/2020',
      // datePicker additional options
      // (see https://github.com/dbushell/Pikaday#configuration)
      datePickerConfig: {
        // First day of the week (0: Sunday, 1: Monday, etc)
        firstDay: 0,
        showWeekNumber: true,
        disableDayFn(date) {
          // Disable Sunday and Saturday
          return date.getDay() === 0 || date.getDay() === 6;
        },
      },
      
    },
  ],
  licenseKey: "non-commercial-and-evaluation",
});
