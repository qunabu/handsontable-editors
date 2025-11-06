import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { components, coutries, data } from "./src/data";
import { editorBaseFactory, rendererFactory, editorFactory } from "./src/factories";
import { multipleSelect, MultipleSelectInstance } from "multiple-select-vanilla";
import "multiple-select-vanilla/dist/styles/css/multiple-select.css";
registerAllModules();

const container = document.querySelector("#handsontable-grid")!;

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerHTML = value.length > 0
      ? value.map((el: { label: string }) => el.label).join(", ")
      : "No elements";
    return td;
  }),
  editor: editorFactory<{input: HTMLSelectElement, multiselect: MultipleSelectInstance}>({
    init(editor) {
      editor.input = editor.hot.rootDocument.createElement("SELECT") as HTMLSelectElement;
      editor.input.setAttribute("multiple", "multiple");
      editor.input.setAttribute("data-multi-select", "");
      editor.multiselect = multipleSelect(editor.input) as MultipleSelectInstance;
    },

    beforeOpen(editor, { cellProperties} ) {
      editor.input.innerHTML = cellProperties?.selectMultipleOptions?.map((
        el: { value: string; label: string },
      ) => `<option value="${el.value}">${el.label}</option>`).join("");
      editor.multiselect.refresh();
    },
    afterOpen(editor) {
      editor.multiselect.open();
    },
    getValue(editor) {
      return Array.from(editor.input.options).filter((option) =>
        option.selected
      ).map((option) => ({ value: option.value, label: option.label }));
    },
    setValue(editor, value) {
      // https://github.com/handsontable/handsontable/issues/3510
      value = typeof value === "string" ? editor.originalValue : value;
      Array.from(editor.input.options).forEach((option) =>
        option.selected = value.some((el: { value: string }) =>
          el.value === option.value
        )
      );
      editor.multiselect.refresh();
    },
    
  }),
};

new Handsontable(container, {
  data,
  colHeaders: [
    "ID",
    "Item Name",
    "Components",
    "Countries",
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
      data: "components",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
      selectMultipleOptions: components,
    },
    {
      data: "countries",
      width: 150,
      allowInvalid: false,
      ...cellDefinition,
      selectMultipleOptions: coutries,
    },
  ],
  licenseKey: "non-commercial-and-evaluation",
});
