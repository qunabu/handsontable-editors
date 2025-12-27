import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
registerAllModules();

import { data } from "./src/data";

// Define the shape of values passed to children
interface EditorChildrenProps {
  value: string;
  setValue: (value: string) => void;
  finishEditing: () => void;
  isOpen: boolean;
}

interface EditorComponentProps {
  children: (props: EditorChildrenProps) => React.ReactNode;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ children }) => {
  const mainElementRef = useRef<HTMLDivElement>(null);

  const { value, setValue, finishEditing, isOpen, ...rest } = useHotEditor({
    onPrepare: (_row, _column, _prop, TD, _originalValue, _cellProperties) => {
      const tdPosition = TD.getBoundingClientRect();
      if (!mainElementRef.current) return;
      mainElementRef.current.style.left = `${tdPosition.left + window.pageXOffset}px`;
      mainElementRef.current.style.top = `${tdPosition.top + window.pageYOffset}px`;
    },
    onOpen: () => {
      console.log('onOpen');
    },
    onClose: () => {
      console.log('onClose');
      setValue('👍');
      finishEditing();
    },
  });

  return <div onClick={() => {
    console.log('onClick', value, setValue, finishEditing);
    setValue('👍');
    finishEditing();
  }}>Hello</div>;

  return (
    <div 
      ref={mainElementRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        background: '#fff',
        border: '1px solid #000',
        padding: '2px',
        zIndex: 999,
        display: isOpen ? 'block' : 'none',
      }}
    >
      {children({ value, setValue, finishEditing, isOpen })}
    </div>
  );
};

const FeedbackEditor = () => {
  return (
    <EditorComponent>
      {({ value, setValue, finishEditing }) => (
        <button onClick={() => {
          console.log('Current value:', value);
          //setValue('👍');
          //finishEditing();
        }}>
          Apply
        </button>
      )}
    </EditorComponent>
  );
};

export function App() {
  return <h1>Hello world!</h1>;
}
const container = document.getElementById("handsontable-grid");
const root = createRoot(container)
root.render(<HotTable
  themeName="ht-theme-main-dark-auto"
  // other options
  data={data}
  rowHeaders={true}
  colHeaders={true}
  height="auto"
  autoWrapRow={true}
  autoWrapCol={true}
  licenseKey="non-commercial-and-evaluation" // for non-commercial use only
>
<HotColumn width={250} editor={EditorComponent} data="id" />
</HotTable>);