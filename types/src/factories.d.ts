import Handsontable from "handsontable";
import { BaseEditor } from "handsontable/editors";
/**
 * Factory function for creating custom Handsontable editors by extending BaseEditor.
 *
 * This factory allows you to create custom editors by providing implementations for various
 * editor lifecycle methods. It handles the prototype chain setup and method delegation to
 * the BaseEditor superclass automatically.
 *
 * @template T - Additional custom properties and methods to add to the editor instance.
 *
 * @param {object} params - Configuration object containing editor lifecycle methods and custom methods.
 * @param {Function} params.prepare - Called before editing begins to initialize the editor.
 * @param {Function} params.beginEditing - Called when editing starts.
 * @param {Function} params.finishEditing - Called when editing ends.
 * @param {Function} params.discardEditor - Called to discard editor changes.
 * @param {Function} params.saveValue - Called to save the edited value.
 * @param {Function} params.getValue - Called to retrieve the current editor value.
 * @param {Function} params.setValue - Called to set the editor value.
 * @param {Function} params.open - Called to open/show the editor UI.
 * @param {Function} params.close - Called to close/hide the editor UI.
 * @param {Function} params.focus - Called to focus the editor.
 * @param {Function} params.cancelChanges - Called to cancel editing changes.
 * @param {Function} params.checkEditorSection - Called to determine which section the editor belongs to.
 * @param {Function} params.enableFullEditMode - Called to enable full edit mode.
 * @param {Function} params.extend - Called to extend the editor class.
 * @param {Function} params.getEditedCell - Called to get the currently edited cell element.
 * @param {Function} params.getEditedCellRect - Called to get the edited cell's position and dimensions.
 * @param {Function} params.getEditedCellsZIndex - Called to get the z-index for the edited cell.
 * @param {Function} params.init - Called during editor initialization.
 * @param {Function} params.isInFullEditMode - Called to check if editor is in full edit mode.
 * @param {Function} params.isOpened - Called to check if editor is currently open.
 * @param {Function} params.isWaiting - Called to check if editor is waiting for input.
 *
 * @returns {Function} A custom editor class extending Handsontable's BaseEditor.
 *
 * @example
 * ```typescript
 * const MyEditor = editorBaseFactory({
 *   prepare(editor, row, col, prop, td, originalValue, cellProperties) {
 *     // Initialize your editor
 *   },
 *   open(editor) {
 *     // Show your editor UI
 *   },
 *   close(editor) {
 *     // Hide your editor UI
 *   },
 *   getValue(editor) {
 *     return editor.customValue;
 *   }
 * });
 * ```
 */
export declare const editorBaseFactory: <T>(params: {
    prepare?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.prepare>) => void;
    beginEditing?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.beginEditing>) => void;
    finishEditing?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.finishEditing>) => void;
    discardEditor?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.discardEditor>) => void;
    saveValue?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.saveValue>) => void;
    getValue?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.getValue>) => any;
    setValue?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.saveValue>) => void;
    open?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.open>) => void;
    close?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.close>) => void;
    focus?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.focus>) => void;
    cancelChanges?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.cancelChanges>) => void;
    checkEditorSection?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.checkEditorSection>) => "top-left-corner" | "top" | "bottom-left-corner" | "bottom" | "left" | "";
    enableFullEditMode?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.enableFullEditMode>) => void;
    extend?(...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.extend>): BaseEditor;
    getEditedCell?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.getEditedCell>) => HTMLTableCellElement | null;
    getEditedCellRect?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.getEditedCellRect>) => {
        top: number;
        start: number;
        width: number;
        maxWidth: number;
        height: number;
        maxHeight: number;
    } | undefined;
    getEditedCellsZIndex?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.getEditedCellsZIndex>) => string;
    init?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.init>) => void;
    isInFullEditMode?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.isInFullEditMode>) => boolean;
    isOpened?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.isOpened>) => boolean;
    isWaiting?: (editor: BaseEditor & T, ...args: Parameters<typeof Handsontable.editors.BaseEditor.prototype.isWaiting>) => boolean;
} & Record<string, (editor: BaseEditor & T, ...args: any[]) => void>) => BaseEditor;
/**
 * Factory function for creating custom Handsontable cell renderers.
 *
 * This factory simplifies the creation of custom cell renderers by wrapping the standard
 * Handsontable renderer function signature with a more convenient object-based callback.
 *
 * @param {Function} callback - Function that renders the cell content.
 * @param {object} callback.instance - The Handsontable instance.
 * @param {HTMLElement} callback.td - The table cell element to render into.
 * @param {number} callback.row - The row index of the cell.
 * @param {number} callback.column - The column index of the cell.
 * @param {string|number} callback.prop - The property name or column index.
 * @param {*} callback.value - The current value of the cell.
 * @param {object} callback.cellProperties - The cell's configuration properties.
 *
 * @returns {Function} A renderer function compatible with Handsontable's renderer API.
 *
 * @example
 * ```typescript
 * const myRenderer = rendererFactory(({ td, value, cellProperties }) => {
 *   td.innerHTML = '';
 *   const div = document.createElement('div');
 *   div.textContent = value || '';
 *   div.style.color = cellProperties.customColor || 'black';
 *   td.appendChild(div);
 * });
 *
 * // Use in column definition
 * const columns = [{
 *   data: 'myColumn',
 *   renderer: myRenderer
 * }];
 * ```
 */
export declare const rendererFactory: (callback: ({ instance, td, row, column, prop, value, cellProperties }: {
    instance: Handsontable.Core;
    td: HTMLTableCellElement;
    row: number;
    column: number;
    prop: string | number;
    value: any;
    cellProperties: Handsontable.CellProperties;
}) => void) => (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, column: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => void;
type ExtendedEditor<T> = BaseEditor & {
    render: (editor: ExtendedEditor<T>) => void;
    value?: any;
    config?: any;
    container: HTMLDivElement;
    position: "containter" | "portal";
} & T;
/**
 * Factory function to create a custom Handsontable editor.
 *
 * `editorFactory` helps you create modular, reusable, and fully custom editors
 * for Handsontable grid cells. The factory handles lifecycle, DOM structure, and
 * keyboard shortcuts, allowing you to focus on business-specific UI and value logic.
 *
 * @template T The custom type extending editor interface for your editor instance.
 *
 * @param {object} options - Configuration and lifecycle methods for the editor.
 * @param {(editor: ExtendedEditor<T>) => void} options.init
 *        Required. Initialization logic. Assigns and sets up the editor input (and other UI).
 * @param {(editor: ExtendedEditor<T>) => void} [options.afterOpen]
 *        Optional. Called after the editor is opened and made visible.
 * @param {(editor: ExtendedEditor<T>) => void} [options.afterInit]
 *        Optional. Called immediately after init, useful for event binding, etc.
 * @param {(editor: ExtendedEditor<T>, context: {row:number, col:number, prop:string|number, td:HTMLTableCellElement, originalValue:any, cellProperties:Handsontable.CellProperties}) => void} [options.beforeOpen]
 *        Optional. Called before the editor is opened so you can set its value/state.
 * @param {(editor: ExtendedEditor<T>) => any} [options.getValue]
 *        Optional. Custom way to retrieve value from the editor input.
 * @param {(editor: ExtendedEditor<T>, value: any) => void} [options.setValue]
 *        Optional. Custom way to set value to the editor input.
 * @param {(editor: ExtendedEditor<T>) => void} [options.onFocus]
 *        Optional. Logic to focus the intended input/button/etc within your editor UI.
 * @param {Array<Object>} [options.shortcuts]
 *        Optional. Array of shortcut definitions. Each entry should have:
 *        - keys: string[][] (e.g. [['1'], ['ArrowLeft']] )
 *        - callback: (editor, event) => boolean|void, function to handle the keyboard event.
 *        - other Handsontable shortcut runner parameters (see cell editor usage)
 * @param {any} [options.value]
 *        Optional. The initial value for the editor input/state.
 * @param {any} [options.config]
 *        Optional. Configuration or options for the editor (e.g. list of choices).
 * @param {(editor: ExtendedEditor<T>) => void} [options.render]
 *        Optional. Function to refresh/render your editor UI from state/value.
 * @param {...object} [args] Any additional custom fields or helpers you want mixed into the editor instance.
 *
 * @returns {Function} Returns an object compatible with Handsontable editor interface, handling initialization,
 *             value/DOM mapping, shortcut binding, editor lifecycle, and cleanup.
 *
 * @example
 * const emojiEditor = editorFactory({
 *   config: ['👍', '👎', '🤷‍♂️'],
 *   init(editor) {
 *     editor.input = document.createElement('DIV');
 *     // ... setup UI
 *   },
 *   setValue(editor, val) { ... },
 *   getValue(editor) { ... },
 *   render(editor) { ... },
 *   shortcuts: [...]
 * });
 *
 * // In Handsontable columns config:
 * { data: "feedback", editor: emojiEditor }
 */
export declare const editorFactory: <T>({ init, afterOpen, afterInit, afterClose, beforeOpen, getValue, setValue, onFocus, shortcuts, value, render, config, shortcutsGroup, position, ...args }: {
    position?: "container" | "portal";
    value?: T extends {
        value: any;
    } ? T["value"] : any;
    config?: T extends {
        config: any;
    } ? T["config"] : any;
    render?: (editor: ExtendedEditor<T>) => void;
    init: (editor: ExtendedEditor<T>) => void;
    afterOpen?: (editor: ExtendedEditor<T>, event?: Event | undefined) => void;
    afterClose?: (editor: ExtendedEditor<T>) => void;
    afterInit?: (editor: ExtendedEditor<T>) => void;
    beforeOpen?: (editor: ExtendedEditor<T>, { row, col, prop, td, originalValue, cellProperties, }: {
        row: number;
        col: number;
        prop: string | number;
        td: HTMLTableCellElement;
        originalValue: any;
        cellProperties: Handsontable.CellProperties;
    }) => void;
    getValue?: (editor: ExtendedEditor<T>) => any;
    setValue?: (editor: ExtendedEditor<T>, value: any) => void;
    onFocus?: (editor: ExtendedEditor<T>) => void;
    shortcutsGroup?: string;
    shortcuts?: {
        keys: string[][];
        callback: (editor: ExtendedEditor<T>, event: Event) => boolean | void;
        group?: string;
        runOnlyIf?: () => boolean;
        captureCtrl?: boolean;
        preventDefault?: boolean;
        stopPropagation?: boolean;
        relativeToGroup?: string;
        position?: "before" | "after";
        forwardToContext?: any;
    }[];
} & Record<string, any>) => BaseEditor;
export {};
//# sourceMappingURL=factories.d.ts.map