import React, { useState, useCallback, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { EditorComponent } from "./src/EditorComponent";
import { HexColorPicker } from "react-colorful";

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
registerAllModules();

import { data } from "./src/data";


export const ColorPickerEditor = () => {


    return (
        <EditorComponent<string>  >
            {({ value, setValue, finishEditing, mainElementRef }) => {
                return (
                    <div className="color-picker-editor">
                        <HexColorPicker color={value || '#000000'} onChange={color => { setValue(color); }} />
                        <button onClick={() => finishEditing()}>Apply Color</button>
                    </div>
                );
            }}
        </EditorComponent>
    );
};





const RendererComponent:React.FC<{value: string}> = ({ value}) => {
    return (
        <div style={{ backgroundColor: value }}>{value}
            </div>
        
    );
};

const container = document.getElementById("handsontable-grid")!;
const root = createRoot(container)
root.render(<HotTable
    themeName="ht-theme-main-dark-auto"
    data={data}
    rowHeaders={true}
    colHeaders={true}
    height="auto"
    autoWrapRow={true}
    autoWrapCol={true}
    licenseKey="non-commercial-and-evaluation" // for non-commercial use only
>
    <HotColumn width={250} editor={ColorPickerEditor} data="color" title="Color Picker" renderer={RendererComponent} />
    <HotColumn width={250} data="itemName" title="Item Name" />

</HotTable>);

