import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { components, coutries, data } from "./src/data";
import { editorBaseFactory, rendererFactory } from "./src/factories";
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
  editor: editorBaseFactory<{wrapper: HTMLDivElement, input: HTMLSelectElement, multiselect: MultipleSelectInstance}>({
    init(editor) {
      // create the input element on init. This is a text input that color picker will be attached to.
      editor.wrapper = editor.hot.rootDocument.createElement("DIV") as HTMLDivElement;
      editor.wrapper.style.display = "none";
      editor.wrapper.classList.add("htSelectEditor");
      editor.input = editor.hot.rootDocument.createElement("SELECT") as HTMLSelectElement;
      editor.input.setAttribute("multiple", "multiple");
      editor.input.setAttribute("data-multi-select", "");
      editor.wrapper.appendChild(editor.input);
      editor.hot.rootElement.appendChild(editor.wrapper);
      editor.multiselect = multipleSelect(editor.input) as MultipleSelectInstance;
    },
    prepare(editor, row, col, prop, td, originalValue, cellProperties) {
      editor.input.innerHTML = cellProperties?.selectMultipleOptions?.map((
        el: { value: string; label: string },
      ) => `<option value="${el.value}">${el.label}</option>`).join("");
      editor.multiselect.refresh();
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
    open(editor) {
      const rect = editor.getEditedCellRect();
      editor.wrapper.style =
        `display: block; min-height: 200px; border:none; box-sizing: border-box; margin:0; padding:0 4px; position: absolute; top: ${rect.top}px; left: ${rect.start}px; width: ${rect.width}px; height: ${rect.height}px;`;
      editor.multiselect.open();
    },
    focus(editor) {
      editor.input.focus();
    },
    close(editor) {
      editor.wrapper.style.display = "none";
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
      // TODO fix ts types style to allow this to work, or add additional prop to cellDefinition
      // @ts-ignore 
      selectMultipleOptions: coutries,
    },
  ],
  licenseKey: "non-commercial-and-evaluation",
});
