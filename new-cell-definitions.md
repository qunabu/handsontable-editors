# Simplified Custom Cell Definitions

## Overview

This document describes a simplified approach to creating custom cell types in Handsontable. Traditional custom cell creation (as described in the [official documentation](./cell-definitions.md)) requires extensive boilerplate code, deep understanding of the Handsontable architecture, and careful implementation of multiple lifecycle methods.

Our new factory-based approach reduces complexity significantly while maintaining full access to Handsontable's features.

## Why This Approach?

The traditional approach to creating custom cells has several challenges:

1. **Steep Learning Curve**: Requires understanding of EditorManager, BaseEditor lifecycle, and complex inheritance patterns
2. **Boilerplate Code**: Lots of repetitive code for simple customizations
3. **Error-Prone**: Easy to miss critical lifecycle methods or forget to call super methods
4. **Poor Developer Experience**: Not optimized for modern workflows (AI assistance, quick prototyping)

Our goal: **Make custom cell creation so simple that any developer can create a custom cell in minutes with AI assistance.**

## The New Approach

We provide two factory functions that handle the complexity internally:

### 1. `rendererFactory`

A simplified way to create cell renderers.

**Signature:**
```typescript
rendererFactory((params) => {
  // params.instance - Handsontable instance
  // params.td - Table cell element
  // params.row - Row index
  // params.column - Column index
  // params.prop - Property name
  // params.value - Cell value
  // params.cellProperties - Cell configuration
})
```

**Example:**
```typescript
const renderer = rendererFactory(({ td, value }) => {
  td.style.backgroundColor = value;
  td.innerHTML = `<b>${value}</b>`;
});
```

### 2. `editorBaseFactory`

A simplified way to create custom editors by defining only the methods you need.

**Signature:**
```typescript
editorBaseFactory<CustomProperties>({
  init(editor) { /* One-time setup */ },
  getValue(editor) { /* Return current value */ },
  setValue(editor, value) { /* Set value */ },
  open(editor) { /* Show editor */ },
  close(editor) { /* Hide editor */ },
  focus(editor) { /* Focus editor */ },
  prepare(editor, row, col, prop, td, originalValue, cellProperties) { /* Per-cell setup */ }
})
```

**Key Features:**
- Only implement the methods you need
- Automatic `super` method handling
- Type-safe custom properties via generics
- Direct access to editor instance properties

## Core Concepts

### Cell Definition Structure

A complete cell definition includes three components:

```typescript
const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    // Display the cell value
    td.innerText = value;
  }),
  
  validator: (value, callback) => {
    // Validate the value
    callback(isValid);
  },
  
  editor: editorBaseFactory({
    // Editor lifecycle methods
  })
};
```

### Editor Lifecycle Methods

Understanding when each method is called:

1. **`init(editor)`** - Called once when the editor is created (singleton pattern)
   - Create DOM elements
   - Set up event listeners
   - Initialize third-party libraries

2. **`prepare(editor, ...args)`** - Called every time a cell is selected
   - Update editor state for the current cell
   - Read cell-specific configuration
   - Pre-populate options or data

3. **`open(editor)`** - Called when the user starts editing
   - Position the editor over the cell
   - Show the editor UI
   - Focus the input

4. **`getValue(editor)`** - Called when saving the value
   - Return the current editor value

5. **`setValue(editor, value)`** - Called to set the initial value
   - Update the editor with the cell's current value

6. **`focus(editor)`** - Called when the editor needs focus
   - Ensure the input element is focused

7. **`close(editor)`** - Called when editing ends
   - Hide the editor
   - Clean up temporary state

### Custom Properties with TypeScript

Define custom properties for your editor using generics:

```typescript
type MyEditorProps = {
  input: HTMLInputElement;
  wrapper: HTMLDivElement;
  myLibraryInstance: any;
};

const editor = editorBaseFactory<MyEditorProps>({
  init(editor) {
    // TypeScript knows about editor.input, editor.wrapper, etc.
    editor.input = document.createElement('INPUT');
    editor.wrapper = document.createElement('DIV');
  },
  getValue(editor) {
    return editor.input.value; // Fully typed!
  }
});
```

## Common Patterns

### Pattern 1: Simple Input Wrapper

For wrapping HTML5 inputs:

```typescript
editor: editorBaseFactory<{input: HTMLInputElement}>({
  init(editor) {
    editor.input = editor.hot.rootDocument.createElement('INPUT');
    editor.input.type = 'text'; // or 'date', 'color', etc.
    editor.hot.rootElement.appendChild(editor.input);
  },
  getValue(editor) { return editor.input.value; },
  setValue(editor, value) { editor.input.value = value; },
  open(editor) {
    const rect = editor.getEditedCellRect();
    editor.input.style.cssText = `
      position: absolute;
      top: ${rect.top}px;
      left: ${rect.start}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      display: block;
    `;
  },
  close(editor) { editor.input.style.display = 'none'; }
})
```

### Pattern 2: Third-Party Library Integration

For integrating libraries like date pickers, color pickers, etc.:

```typescript
editor: editorBaseFactory<{input: HTMLInputElement, picker: PickerInstance}>({
  init(editor) {
    editor.input = editor.hot.rootDocument.createElement('INPUT');
    editor.hot.rootElement.appendChild(editor.input);
    editor.picker = initPicker(editor.input);
    
    // Handle picker events
    editor.picker.on('change', () => {
      editor.finishEditing();
    });
  },
  open(editor) {
    // Position and show
    const rect = editor.getEditedCellRect();
    editor.input.style.cssText = `...`;
    editor.picker.open();
  }
})
```

### Pattern 3: Preventing Click-Outside Closing

For editors with dropdowns or overlays:

```typescript
init(editor) {
  editor.eventManager = new Handsontable.EventManager(editor.wrapper);
  editor.eventManager.addEventListener(document.body, 'mousedown', (event) => {
    if (editor.dropdown.contains(event.target)) {
      event.stopPropagation(); // Prevent Handsontable from closing editor
    }
  });
}
```

### Pattern 4: Per-Cell Configuration

Use the `prepare` method to read cell-specific settings:

```typescript
prepare(editor, row, col, prop, td, originalValue, cellProperties) {
  // Access custom cell properties
  const options = cellProperties.customOptions;
  editor.updateOptions(options);
  
  // Set initial value
  editor.input.value = originalValue;
}
```

## Usage in Handsontable

Apply your cell definition to columns:

```typescript
new Handsontable(container, {
  data: myData,
  columns: [
    { data: 'id', type: 'numeric' },
    { 
      data: 'customField',
      ...cellDefinition, // Spread renderer, validator, editor
      allowInvalid: false,
      // Any custom properties
      customOptions: { /* ... */ }
    }
  ]
});
```

## Best Practices

### 1. Performance

- Create DOM elements in `init()`, not `open()`
- Reuse instances when possible
- Keep renderers simple and fast

### 2. Positioning

Always position editors using `getEditedCellRect()`:

```typescript
open(editor) {
  const rect = editor.getEditedCellRect();
  editor.wrapper.style = `
    position: absolute;
    top: ${rect.top}px;
    left: ${rect.start}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
  `;
}
```

### 3. Cleanup

Clean up resources in `close()` if needed:

```typescript
close(editor) {
  editor.wrapper.style.display = 'none';
  // Release resources if needed
  // editor.picker.destroy(); // Example
}
```

### 4. Validation

Use validators to ensure data integrity:

```typescript
validator: (value, callback) => {
  // Synchronous validation
  callback(isValid(value));
  
  // Or asynchronous
  validateAsync(value).then(isValid => {
    callback(isValid);
  });
}
```

### 5. Keyboard Navigation

Handsontable handles most keyboard navigation automatically. For special cases:

```typescript
init(editor) {
  editor.input.addEventListener('keydown', (event) => {
    // Handle special keys if needed
    if (event.key === 'Tab') {
      // Custom behavior
    }
  });
}
```

## TypeScript Support

Full TypeScript support with type inference:

```typescript
import { editorBaseFactory, rendererFactory } from './src/factories';
import type Handsontable from 'handsontable';

// Define your custom properties type
type CustomEditorProps = {
  input: HTMLInputElement;
  wrapper: HTMLDivElement;
};

// Factory provides full type safety
const editor = editorBaseFactory<CustomEditorProps>({
  init(editor) {
    // editor.input is fully typed
    editor.input = editor.hot.rootDocument.createElement('INPUT');
  }
});
```

## Examples

👉 **[Browse All Recipes](./recipes.md)** - Find recipes by use case, difficulty, or technology

We provide complete working examples for common use cases:

1. **[Color Picker](./guide-color-picker.md)** - Integrate a color picker library
2. **[Flatpickr Date Picker](./guide-flatpickr.md)** - Advanced date picker with options
3. **[Native Date Input](./guide-input-date.md)** - HTML5 date input
4. **[Range Slider](./guide-input-range.md)** - Interactive range input
5. **[Multiple Select](./guide-select-multiple.md)** - Multi-select dropdown

## Migration from Traditional Approach

If you have existing custom editors, migration is straightforward:

**Before (Traditional):**
```javascript
class CustomEditor extends Handsontable.editors.BaseEditor {
  constructor(instance) {
    super(instance);
  }
  
  init() {
    this.input = document.createElement('INPUT');
    // ...
  }
  
  getValue() {
    return this.input.value;
  }
  
  // ... many more methods
}
```

**After (Factory):**
```typescript
const editor = editorBaseFactory<{input: HTMLInputElement}>({
  init(editor) {
    editor.input = editor.hot.rootDocument.createElement('INPUT');
  },
  getValue(editor) {
    return editor.input.value;
  }
});
```

## Troubleshooting

### Editor Not Showing

- Check that `open()` sets `display: block`
- Verify positioning with `getEditedCellRect()`
- Ensure z-index is appropriate

### Value Not Saving

- Verify `getValue()` returns the correct value
- Check validator is calling `callback(true)`
- Ensure `setValue()` properly updates the editor

### Click Outside Closes Immediately

- Use `EventManager` to stop propagation
- See Pattern 3 above

## Contributing

Have you created a useful custom cell? Consider contributing it as an example!

## Next Steps

- **[Browse All Recipes](./recipes.md)** - Find the perfect recipe for your use case
- **[Step-by-Step Guides](./recipes.md#-custom-cell-definitions)** - Complete implementation tutorials
- **[Source Code](./src/factories.ts)** - Understand the factory implementation
- **[Live Examples](./recipes.md#-find-a-recipe)** - Interactive demos

---

*This approach aims to make Handsontable custom cells as accessible as possible, enabling teams to create custom cells in minutes rather than hours.*

