import Handsontable from "handsontable";
// todo: ts use generic type and return is instaedh of editor: Handsontable.editors.TextEditor,
export const editorTextFactory = (
    params: {
      createElements?: (
        editor: Handsontable.editors.TextEditor,
      ) => void;
      prepare?: (
        editor: Handsontable.editors.TextEditor,
        row: number,
        col: number,
        prop: number | string,
        td: HTMLTableCellElement,
        originalValue: any,
        cellProperties: Handsontable.CellProperties,
      ) => void;
      beginEditing?: (
        editor: Handsontable.editors.TextEditor,
        newInitialValue: any,
        event: any,
      ) => void;
      finishEditing?: (
        editor: Handsontable.editors.TextEditor,
        restoreOriginalValue: boolean,
        ctrlDown: boolean,
        callback: (isValid: boolean) => void,
      ) => void;
      discardEditor?: (
        editor: Handsontable.editors.TextEditor,
        result: boolean,
      ) => void;
      saveValue?: (
        editor: Handsontable.editors.TextEditor,
        value: any,
        ctrlDown: boolean,
      ) => void;
      getValue?: (editor: Handsontable.editors.TextEditor) => any;
      setValue?: (editor: Handsontable.editors.TextEditor, newValue: any) => void;
      open?: (editor: Handsontable.editors.TextEditor) => void;
      close?: (editor: Handsontable.editors.TextEditor) => void;
      focus?: (editor: Handsontable.editors.TextEditor) => void;
    },
  ) => {
    const CustomTextEditor = Handsontable.editors.TextEditor.prototype.extend();

    const skipSuperApply = [
      'setValue'
    ]
  
    for (const fnName in Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype)
    ) {
      if (params[fnName]) {
        const superFn = CustomTextEditor.prototype[fnName];
        CustomTextEditor.prototype[fnName] = function (...args: any[]) {
          !skipSuperApply.includes(fnName) && superFn.apply(this, args);
          return params[fnName](this, args);
        };
      }
    }
 
    return CustomTextEditor;
  };
  
  export const editorBaseFactory = (
    params: {
      createElements?: (
        editor: Handsontable.editors.BaseEditor,
      ) => void;
      prepare?: (
        editor: Handsontable.editors.BaseEditor,
        row: number,
        col: number,
        prop: number | string,
        td: HTMLTableCellElement,
        originalValue: any,
        cellProperties: Handsontable.CellProperties,
      ) => void;
      beginEditing?: (
        editor: Handsontable.editors.BaseEditor,
        newInitialValue: any,
        event: any,
      ) => void;
      finishEditing?: (
        editor: Handsontable.editors.BaseEditor,
        restoreOriginalValue: boolean,
        ctrlDown: boolean,
        callback: (isValid: boolean) => void,
      ) => void;
      discardEditor?: (
        editor: Handsontable.editors.BaseEditor,
        result: boolean,
      ) => void;
      saveValue?: (
        editor: Handsontable.editors.BaseEditor,
        value: any,
        ctrlDown: boolean,
      ) => void;
      getValue?: (editor: Handsontable.editors.BaseEditor) => any;
      setValue?: (editor: Handsontable.editors.BaseEditor, newValue: any) => void;
      open?: (editor: Handsontable.editors.BaseEditor) => void;
      close?: (editor: Handsontable.editors.BaseEditor) => void;
      focus?: (editor: Handsontable.editors.BaseEditor) => void;
    },
  ) => {
    const CustomBaseEditor = Handsontable.editors.BaseEditor.prototype.extend();
    
    const skipSuperApply = [
      'setValue', 'open', 'getValue', 'close'
    ]
  
    const prototypeFns = Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype);
  
    for (const fnName of prototypeFns) {
      if (params[fnName]) {
        const superFn = CustomBaseEditor.prototype[fnName];
        CustomBaseEditor.prototype[fnName] = function (...args: any[]) {
          !skipSuperApply.includes(fnName) && superFn.apply(this, args);
          return params[fnName](this, ...args);
        };
      } 
    }
  
    for (const fnName of Object.keys(params)) {
      if (!prototypeFns.includes(fnName)) {
        CustomBaseEditor.prototype[fnName] = function (...args: any[]) {
          return params[fnName](this, ...args);
        };
      }
    }
  
    return CustomBaseEditor;
  };
  
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
    return (instance, td, row, column, prop, value, cellProperties) => {
      callback({ instance, td, row, column, prop, value, cellProperties });
    };
  };
  // }
  