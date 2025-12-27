import React, { useState, useCallback, useRef, useEffect } from "react";
import type { ComponentProps, Dispatch } from "react";
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable/base';

// Values passed to children render prop
export type EditorChildrenProps<T> = {
  value: T;
  setValue: Dispatch<T>;
  finishEditing: () => void;
  isOpen: boolean;
  row: number | undefined;
  col: number | undefined;
  mainElementRef: React.RefObject<HTMLDivElement>;
}

// Render prop function type
export type EditorRenderProp<T> = (props: EditorChildrenProps<T>) => React.ReactNode;

// EditorComponent props - children typed to work with JSX syntax
export type EditorComponentProps = {
  //children?: React.ReactNode;
  onPrepare?: (row: number, column: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onFocus?: () => void;
  shortcutsGroup?: string;
  shortcuts?: {
    keys: string[][];
    callback: (props:any, event: KeyboardEvent) => boolean | void;
    group?: string;
    runOnlyIf?: () => boolean;
    captureCtrl?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
    relativeToGroup?: string;
    position?: "before" | "after";
    forwardToContext?: any;
  }[];
}

export type EditorComponentType = React.FC<EditorComponentProps>;

export function EditorComponent<T = any>({
  onPrepare,
  onClose,
  onOpen,
  onFocus,
  children,
  shortcutsGroup = "custom-editor",
  shortcuts,
}: EditorComponentProps & { children?: EditorRenderProp<T> }): React.ReactElement {
  const mainElementRef = useRef<HTMLDivElement>(null);

  const instance = useRef<Handsontable.Core>(null);
  const currentValue = useRef<T>(undefined);

  const registerShortcuts = useCallback(() => {
    if (!instance.current) return;

    instance.current?.getShortcutManager().setActiveContextName("editor");

    const shortcutManager = instance.current.getShortcutManager();
    const editorContext = shortcutManager.getContext('editor');
    const contextConfig = {
      group: shortcutsGroup,
    };

    if (shortcuts) {
      editorContext?.addShortcuts(shortcuts.map(shortcut => ({
        ...shortcut,
        group: shortcut.group || shortcutsGroup,
        relativeToGroup: shortcut.relativeToGroup ||
          'editorManager.handlingEditor',
        position: shortcut.position || 'before',
        callback: (event: KeyboardEvent) =>
          shortcut.callback({ value: currentValue.current, setValue, finishEditing }, event),
      })),
        //@ts-ignore
        contextConfig
      );
    }
  }, [shortcuts]);


  const unRegisterShortcuts = useCallback(() => {
    if (!instance.current) return;
   
    const shortcutManager = instance.current.getShortcutManager();
    const editorContext = shortcutManager.getContext("editor")!;
    editorContext.removeShortcutsByGroup(shortcutsGroup);

  }, [shortcuts]);


  const { value, setValue, finishEditing, isOpen, col, row } = useHotEditor<T>({
    onOpen: () => {
      if (!mainElementRef.current) return;
      mainElementRef.current.style.display = 'block';
      onOpen?.();
      registerShortcuts();
    },
    onClose: () => {
      if (!mainElementRef.current) return;
      mainElementRef.current.style.display = 'none';
      onClose?.();
      unRegisterShortcuts();
    },
    onPrepare: (_row, _column, _prop, TD, _originalValue, _cellProperties) => {
      instance.current = _cellProperties.instance;
      const tdPosition = TD.getBoundingClientRect();
      const rect = _cellProperties.editor;
      if (!mainElementRef.current) return;

      // TODO: Implement RTL support, fix wrapper to get editor instance and use `const rect = editor.getEditedCellRect();` 
      //mainElementRef.current.style[_cellProperties.instance.isRtl() ? 'right' : 'left'] = `${tdPosition.left}px`;

      mainElementRef.current.style.left = `${tdPosition.left + window.pageXOffset - 1}px`;
      mainElementRef.current.style.top = `${tdPosition.top + window.pageYOffset - 1}px`;
      mainElementRef.current.style.width = `${tdPosition.width}px`;
      mainElementRef.current.style.height = `${tdPosition.height}px`;
      onPrepare?.(_row, _column, _prop, TD, _originalValue, _cellProperties);
    },
    onFocus: () => {
      onFocus?.();
    },
  });

  useEffect(() => {
    currentValue.current = value;
  }, [value]);


  const stopMousedownPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  return (
    <div
      id="editorElement"
      ref={mainElementRef}
      style={{
        display: 'none',
        position: 'absolute',
        background: '#fff',
        border: '0px',
        padding: '0px',
        zIndex: 999,
      }}
      onMouseDown={stopMousedownPropagation}
    >

      {(children as EditorRenderProp<T>)({ value: value as T, setValue, finishEditing, mainElementRef: mainElementRef as React.RefObject<HTMLDivElement>, isOpen, col, row })}

    </div>
  );
};