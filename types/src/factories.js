import Handsontable from "handsontable";
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
export const editorBaseFactory = (params) => {
    const CustomBaseEditor = Handsontable.editors.BaseEditor.prototype.extend();
    // Skip super in abstract funtions
    const skipSuperApply = [
        "close",
        "focus",
        "getValue",
        "open",
        "setValue",
    ];
    const prototypeFns = Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype);
    // Apply editor class methods from params object
    for (const fnName of prototypeFns) {
        if (params[fnName]) {
            const superFn = CustomBaseEditor.prototype[fnName];
            CustomBaseEditor.prototype[fnName] = function (...args) {
                !skipSuperApply.includes(fnName) && superFn.apply(this, args);
                return params[fnName](this, ...args);
            };
        }
    }
    // Apply custom methods
    for (const fnName of Object.keys(params)) {
        if (!prototypeFns.includes(fnName)) {
            CustomBaseEditor.prototype[fnName] = function (...args) {
                // `this` will be BaseEditor & T, as expected for custom methods.
                return params[fnName](this, ...args);
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
export const rendererFactory = (callback) => {
    return (instance, td, row, column, prop, value, cellProperties) => {
        callback({ instance, td, row, column, prop, value, cellProperties });
    };
};
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
 * @param {string} [options.position] 
 *  The position of the editor. Either 'container' (default) or 'portal' (for elements outside of the table container viewport).
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
export const editorFactory = ({ init, afterOpen, afterInit, afterClose, beforeOpen, getValue, setValue, onFocus, shortcuts, value, render, config, shortcutsGroup = "custom-editor", position = "container", ...args }) => {
    /**
     * Register all configured keyboard shortcuts for this editor instance.
     * @private
     */
    const registerShortcuts = (editor) => {
        const shortcutManager = editor.hot.getShortcutManager();
        const editorContext = shortcutManager.getContext("editor");
        const contextConfig = {
            group: shortcutsGroup,
        };
        if (shortcuts) {
            editorContext.addShortcuts(shortcuts.map((shortcut) => ({
                ...shortcut,
                relativeToGroup: shortcut.relativeToGroup ||
                    "editorManager.handlingEditor",
                position: shortcut.position || "before",
                callback: (event) => shortcut.callback(editor, event),
            })), 
            //@ts-ignore
            contextConfig);
        }
    };
    // Compose the Handsontable editor definition using the core editorBaseFactory:
    return editorBaseFactory({
        /**
         * Called when this editor is constructed by the Handsontable grid.
         * Assigns value/config/render/etc, creates UI container, initializes with provided init.
         */
        init(editor) {
            Object.assign(editor, { value, config, render, position, ...args });
            editor._open = false;
            editor.container = editor.hot.rootDocument.createElement("DIV");
            editor.container.style.display = "none";
            editor.container.classList.add("htSelectEditor");
            editor.hot.rootElement.appendChild(editor.container);
            init(editor);
            if (!editor.input) {
                console.error("input not found");
            }
            if (position === "portal") {
                //@ts-ignore
                editor.hot.rootPortalElement.appendChild(editor.container);
            }
            else {
                editor.hot.rootElement.appendChild(editor.container);
            }
            editor.container.appendChild(editor.input);
            if (typeof afterInit === "function") {
                afterInit(editor);
            }
        },
        /**
         * Retrieve the value from the editor UI.
         */
        getValue(editor) {
            if (typeof getValue === "function") {
                return getValue(editor);
            }
            return editor.value;
        },
        /**
         * Set the editor's value and update any UI as needed.
         */
        setValue(editor, value) {
            if (typeof setValue === "function") {
                setValue(editor, value);
            }
            else {
                editor.value = value;
            }
            if (typeof render === "function") {
                render(editor);
            }
        },
        /**
         * Opens the editor, making the container visible and binding shortcuts.
         */
        open(editor, event = undefined) {
            const rect = editor.getEditedCellRect();
            editor.container.style.display = "block";
            editor.container.style.position = "absolute";
            if (editor.position === "portal") {
                const offset = editor.TD.getBoundingClientRect();
                editor.container.style.top = `${editor.hot.rootWindow.pageYOffset + offset.top}px`;
                editor.container.style.left = `${editor.hot.rootWindow.pageXOffset + offset.left}px`;
            }
            else {
                editor.container.style.top = `${rect.top}px`;
                editor.container.style.left = `${rect.start}px`;
                editor.container.style.width = `${rect.width}px`;
                editor.container.style.height = `${rect.height}px`;
            }
            editor.container.classList.add("ht_editor_visible");
            // if (afterOpen) {
            //     window.requestAnimationFrame(() => {
            //         afterOpen(editor, event);
            //     });
            // }
            editor._open = true;
            editor.hot.getShortcutManager().setActiveContextName("editor");
            registerShortcuts(editor);
            if (afterOpen) {
                afterOpen(editor, event);
            }
        },
        /**
         * Focus on the correct UI element within your editor.
         */
        focus(editor) {
            if (typeof onFocus === "function") {
                onFocus(editor);
            }
            else {
                editor.container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
            }
        },
        /**
         * Close the editor UI and cleanup active shortcuts.
         */
        close(editor) {
            editor._open = false;
            editor.container.style.display = "none";
            editor.container.classList.remove("ht_editor_visible");
            const shortcutManager = editor.hot.getShortcutManager();
            const editorContext = shortcutManager.getContext("editor");
            //editorContext.re
            editorContext.removeShortcutsByGroup(shortcutsGroup);
            if (typeof afterClose === "function") {
                afterClose(editor);
            }
        },
        /**
         * Prepare the editor to start editing a new value. Invokes beforeOpen or falls back.
         */
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
            }
            else {
                editor.setValue(originalValue);
            }
        },
    });
};
