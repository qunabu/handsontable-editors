import React, { useState, useCallback, useRef, ComponentProps, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { EditorComponent } from "./src/EditorComponent";

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
registerAllModules();

import { data } from "./src/data";

type EditorComponentProps = ComponentProps<typeof EditorComponent<string>>;

export const LeadEngineerEditor = () => {
  const [config, setConfig] = useState<string[]>(['👍', '👎', '🤷‍♂️']);
  const [shortcuts, setShortcuts] = useState<EditorComponentProps['shortcuts']>([]);
  const onPrepare: EditorComponentProps['onPrepare'] = (_row, _column, _prop, _TD, _originalValue, cellProperties) => {
    setConfig(cellProperties.config as string[]);
  };

  useEffect(() => {
    setShortcuts([
      {
        keys: [['ArrowRight'], ['Tab']],
        callback: ({value, setValue}, _event) => {
          setValue(getNextValue(value));      
          return false;
        }
      }, 
      {
        keys: [['ArrowLeft']],
        callback: ({value, setValue}, _event) => {
          setValue(getPrevValue(value));     
        }
      }
    ])
  }, [config]);

  const getNextValue = useCallback((value: string) => {
    const index = config.indexOf(value);
    return index === config.length - 1 ? config[0] : config[index + 1];
  }, [config]);

  const getPrevValue = useCallback((value: string) => {
    const index = config.indexOf(value);
    return index === 0 ? config[config.length - 1] : config[index - 1];
  }, [config]);

  // const onClose = () => console.log('onClose');
  // const onOpen = () => console.log('onOpen');
  // const onFocus = () => console.log('onFocus');

  return (
    <EditorComponent<string> onPrepare={onPrepare} shortcuts={shortcuts}>
      {({ value, setValue, finishEditing }) => (
        <>
          <style>{`
            .editor {
              box-sizing: border-box;
              display: flex;
              gap: 3px;
              padding: 3px;
              background: rgb(238, 238, 238);
              border: 1px solid rgb(204, 204, 204);
              border-radius: 4px;
              height: 100%;
              width: 100%;
            }
            .button.active:hover,
            .button.active {
              background: #007bff;
              color: white;
            }
            .button:hover {
              background: #f0f0f0;
            }
            .button {
              background: #fff;
              color: black;
              border:none;
              padding: 0;
              margin: 0;
              height: 100%;
              width: 100%;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              cursor: pointer;
            }`}
          </style>
          <div className="editor">
            {config.map((item, _index, _array) => (
              <button
                className={`button ${value === item ? 'active' : ''}`}
                key={item}
                onClick={() => {
                  setValue(item);
                  finishEditing();
                }}
                style={{
                  width: 100 / _array.length + '%'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}
    </EditorComponent>
  );
};

const container = document.getElementById("handsontable-grid")!;
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
  //layoutDirection="rtl"
  licenseKey="non-commercial-and-evaluation" // for non-commercial use only
>
  <HotColumn width={250} editor={LeadEngineerEditor} config={['👍', '👎', '🤷‍♂️']} data="feedback" title="Feedback" />
  <HotColumn width={250} editor={LeadEngineerEditor} config={['1', '2', '3', '4', '5']} data="stars" title="Rating (1-5)" />

</HotTable>);