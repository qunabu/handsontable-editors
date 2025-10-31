import Handsontable from "handsontable";
import { BaseEditor } from "handsontable/editors";
//import { ShortcutManager  } from "handsontable/shortcuts/manager.d.ts";



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
export const editorBaseFactory = <T>(
    params: {
        prepare?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.prepare
            >
        ) => void;
        beginEditing?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.beginEditing
            >
        ) => void;
        finishEditing?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.finishEditing
            >
        ) => void;
        discardEditor?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.discardEditor
            >
        ) => void;
        saveValue?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.saveValue
            >
        ) => void;
        getValue?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.getValue
            >
        ) => any;
        setValue?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.saveValue
            >
        ) => void;
        open?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.open
            >
        ) => void;
        close?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.close
            >
        ) => void;
        focus?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.focus
            >
        ) => void;
        cancelChanges?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.cancelChanges
            >
        ) => void;
        checkEditorSection?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.checkEditorSection
            >
        ) =>
            | "top-left-corner"
            | "top"
            | "bottom-left-corner"
            | "bottom"
            | "left"
            | "";
        enableFullEditMode?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.enableFullEditMode
            >
        ) => void;
        extend?(
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.extend
            >
        ): BaseEditor;
        getEditedCell?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.getEditedCell
            >
        ) => HTMLTableCellElement | null;
        getEditedCellRect?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.getEditedCellRect
            >
        ) => {
            top: number;
            start: number;
            width: number;
            maxWidth: number;
            height: number;
            maxHeight: number;
        } | undefined;
        getEditedCellsZIndex?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.getEditedCellsZIndex
            >
        ) => string;
        init?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.init
            >
        ) => void;
        isInFullEditMode?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.isInFullEditMode
            >
        ) => boolean;
        isOpened?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.isOpened
            >
        ) => boolean;
        isWaiting?: (
            editor: BaseEditor & T,
            ...args: Parameters<
                typeof Handsontable.editors.BaseEditor.prototype.isWaiting
            >
        ) => boolean;
    } & Record<string, (editor: BaseEditor & T, ...args: any[]) => void>,
) => {
    const CustomBaseEditor = Handsontable.editors.BaseEditor.prototype.extend();

    // Skip super in abstract funtions
    const skipSuperApply = [
        "close",
        "focus",
        "getValue",
        "open",
        "setValue",
    ];

    const prototypeFns = Object.getOwnPropertyNames(
        Handsontable.editors.BaseEditor.prototype,
    ) as (keyof BaseEditor)[];

    // Apply editor class methods from params object
    for (const fnName of prototypeFns) {
        if (params[fnName]) {
            const superFn: Function =
                (CustomBaseEditor.prototype as Record<string, any>)[
                    fnName as keyof BaseEditor
                ];

            (CustomBaseEditor.prototype as Record<string, any>)[
                fnName as keyof BaseEditor
            ] = function (...args: any[]) {
                !skipSuperApply.includes(fnName) && superFn.apply(this, args);
                return params[fnName]!(this as BaseEditor & T, ...args);
            };
        }
    }

    // Apply custom methods
    for (const fnName of Object.keys(params)) {
        if (!prototypeFns.includes(fnName as keyof BaseEditor)) {
            (CustomBaseEditor.prototype as Record<string, any>)[
                fnName as keyof BaseEditor
            ] = function (...args: any[]) {
                // `this` will be BaseEditor & T, as expected for custom methods.
                return params[fnName]!(this as BaseEditor & T, ...args);
            };
        }
    }

    return CustomBaseEditor;
};

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
export const rendererFactory = (
    callback: (
        { instance, td, row, column, prop, value, cellProperties }: {
            instance: Handsontable.Core;
            td: HTMLTableCellElement;
            row: number;
            column: number;
            prop: string | number;
            value: any;
            cellProperties: Handsontable.CellProperties;
        },
    ) => void,
) => {
    return (
        instance: Handsontable.Core,
        td: HTMLTableCellElement,
        row: number,
        column: number,
        prop: string | number,
        value: any,
        cellProperties: Handsontable.CellProperties,
    ) => {
        callback({ instance, td, row, column, prop, value, cellProperties });
    };
};
// }

type ExtendedEditor<T> = BaseEditor 
& { render: (editor: ExtendedEditor<T>) => void, value?: any, config?: any } 
& T

export const editorFactory = <T>({
    init,
    afterOpen,
    afterInit,
    beforeOpen,
    getValue,
    setValue,
    onFocus,
    shortcuts,
    value, 
    //valueObject,
    render,
    config,
    ...args
}: {

    value?: T extends { value: any } ? T['value'] : any;
    //valueObject?: T extends { valueObject: any } ? T['valueObject'] : any;
    config?: T extends { config: any } ? T['config'] : any;
    render?: (editor: ExtendedEditor<T>) => void;
    init: (editor: ExtendedEditor<T>) => void;
    afterOpen?: (editor: ExtendedEditor<T>) => void;
    afterInit?: (editor: ExtendedEditor<T>) => void;
    beforeOpen?: (editor: ExtendedEditor<T>, {
        row,
        col,
        prop,
        td,
        originalValue,
        cellProperties,
    }: {
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
    // TODO Shortcut type is not exported 
    shortcuts?: {
        keys: string[][];
        callback: (editor: ExtendedEditor<T>, event: Event) => boolean | void;
        group?: string;
        runOnlyIf?: () => boolean;
        captureCtrl?: boolean;
        preventDefault?: boolean;
        stopPropagation?: boolean;
        relativeToGroup?: string;
        position?: 'before' | 'after';
        forwardToContext?: any;
        // TODO Context type is not exported
        //forwardToContext?: Handsontable.Context;
      }[]
} & Record<string, any>) => {
    // TODO: This should be a unique id for the editor
    const SHORTCUTS_GROUP = "ee";

    const registerShortcuts = (editor: ExtendedEditor<T>) => {
        const shortcutManager = editor.hot.getShortcutManager();
        const editorContext = shortcutManager.getContext("editor")!;
        const contextConfig = {
            group: SHORTCUTS_GROUP,
        };
        if (shortcuts) {
        editorContext.addShortcuts(
            shortcuts.map((shortcut) => ({
                ...shortcut,
                callback: (event: KeyboardEvent) =>
                    shortcut.callback(editor, event),
            })),
            //@ts-ignore
            contextConfig,
        );
        }
    };

    return editorBaseFactory<
    ExtendedEditor<T> & { container: HTMLDivElement; _open: boolean; input: HTMLElement }
    >({
        init(editor) {
            
            Object.assign(editor, { value, config, render, ...args });
            // create the input element on init. This is a text input that color picker will be attached to.
            editor._open = false;
            editor.container = editor.hot.rootDocument.createElement(
                "DIV",
            ) as HTMLDivElement;
            editor.container.style.display = "none";
            editor.container.classList.add("htSelectEditor");
            editor.hot.rootElement.appendChild(editor.container);    
            init(editor);        
            if (!editor.input) {
                console.error("input not found");
            }
            
            editor.container.appendChild(editor.input);
            if (typeof afterInit === "function") {
                afterInit(editor);
            }
        },
        getValue(editor) {
            if (typeof getValue === "function") {
                return getValue(editor);
            }            
            return editor.value;
        },
        setValue(editor, value) {
            if (typeof setValue === "function") {
                setValue(editor, value);
            } else {
                editor.value = value;
            }

            if (typeof render === "function") {
                render(editor);
            }
        },
        open(editor) {
            const rect = editor.getEditedCellRect()!;
            editor.container.style =
                `display: block; border:none; box-sizing: border-box; margin:0; padding:0px; position: absolute; top: ${rect.top}px; left: ${rect.start}px; width: ${rect.width}px; height: ${rect.height}px;`;
            editor.container.classList.add("ht_editor_visible");
            if (afterOpen) {
                window.requestAnimationFrame(() => {
                    afterOpen(editor);
                });
            }
            editor._open = true;
            editor.hot.getShortcutManager().setActiveContextName("editor");
            registerShortcuts(editor);
        },
        focus(editor) {
            if (typeof onFocus === "function") {
                onFocus(editor);
            } else {
                editor.container.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                //@ts-ignore
                )?.focus();
            }
        },
        close(editor) {
            editor._open = false;
            editor.container.style.display = "none";
            editor.container.classList.remove("ht_editor_visible");

            const shortcutManager = editor.hot.getShortcutManager();
            const editorContext = shortcutManager.getContext("editor")!;
            editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP);            
        },
        prepare(editor, row, col, prop, td, originalValue, cellProperties) {
            if (typeof beforeOpen === "function") {
                beforeOpen(editor, {
                    row,
                    col,
                    prop,
                    td,
                    originalValue,
                    cellProperties,
                });
            } else {
                editor.setValue(originalValue);
            }
        },
    });
};
