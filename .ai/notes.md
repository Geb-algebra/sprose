# Project Intelligence for Sprose

This document captures important patterns, preferences, and project intelligence for the Sprose application. It serves as a learning journal to help work more effectively with the project.

## Code Organization Patterns

### Domain-Driven Design

The project follows a domain-driven design approach with a clear separation of concerns:

1. **Define Domain Models First**: Always start by defining domain models and validators in `app/map/models/`.
   - Models are defined with TypeScript types and validated with Zod schemas
   - Example: `Item` type and `itemSchema` in `app/map/models/index.ts`

2. **Create Factory Functions**: Use factory functions like `createNewItem` to encapsulate object creation.
   - Factory functions ensure consistent object creation with proper defaults
   - Example: `createNewItem` and `createEmptyMap` in `app/map/lifecycle/index.ts`

3. **Implement Services as Pure Functions**: Services should be pure functions that don't mutate their inputs.
   - Services implement domain logic without side effects
   - Example: `updateItem`, `deleteItem`, and `moveItem` in `app/map/services/index.ts`

4. **Use Repository Pattern for Storage**: The `MapRepository` class handles all storage operations.
   - Repository methods are static and handle persistence operations
   - Example: `MapRepository.get()`, `MapRepository.save()` in `app/map/lifecycle/index.ts`

### Immutability Pattern

All operations on domain objects must follow an immutability pattern:

- Never mutate domain object instances passed as arguments
- Always create and return new instances with the desired changes
- Use the spread operator for shallow copies and map/filter for array operations
- Example: `{ ...item, children: [...item.children, newChild] }`

This pattern is consistently applied throughout the codebase:

```typescript
// Example from updateItem in services/index.ts
export function updateItem(items: Item, newItem: { id: string } & Partial<Item>): Item {
  if (items.id === newItem.id) {
    return { ...items, ...newItem };
  }
  return {
    ...items,
    children: items.children.map((child) => updateItem(child, newItem)),
  };
}
```

### Recursive Tree Operations

When working with the item tree:

- Use recursive functions to traverse and manipulate the tree
- Each recursive function should handle the base case (target found) and the recursive case
- Return the unchanged item if no changes are needed in that branch
- Example pattern:

  ```typescript
  function operateOnTree(item: Item, targetId: string): Item {
    if (item.id === targetId) {
      // Base case: perform operation on target
      return { ...item, /* changes */ };
    }
    // Recursive case: check children
    return {
      ...item,
      children: item.children.map(child => operateOnTree(child, targetId))
    };
  }
  ```

The project implements several recursive tree operations:

1. **updateItem**: Recursively updates an item in the tree
2. **addNewItem**: Recursively adds a new item to a specific parent
3. **deleteItem**: Recursively removes an item from the tree
4. **findChildById**: Recursively searches for an item by ID
5. **findParentByChildId**: Recursively finds a parent of an item
6. **moveItem**: Combines delete and add operations to move an item

## UI Patterns

### Component Hierarchy

- **Page**: Top-level container for the entire application.
- **ItemFamily**: Container for an item and its children. Handles expansion/collapse and context menus.
    - When collapsed, renders only the item card vertically.
    - When expanded, renders the item card on the left and arranges child groups horizontally using `flex`.
    - Uses `groupChildren` utility to group consecutive non-parent children.
    - Renders child groups using either `ItemFamily` (for children with their own children) or `ChildrenBox`.
- **ItemCard**: Individual item display and editing. Handles context menus and the seamless sequential card addition logic using `addingItemId` context.
- **ChildrenBox**: Renders a vertical grid of non-parent child items within an expanded `ItemFamily`.
- **AddItemButton**: _(Removed/integrated into `ItemCard` editing flow)_. 

### Expanded Horizontal Layout

- When an `ItemFamily` is expanded (`item.isExpanded` is true):
    - The parent `ItemCard` is rendered on the left.
    - The children area uses `display: flex` to arrange child groups horizontally.
    - Child groups are determined by `groupChildren`:
        - Children *with* their own children are rendered as nested `ItemFamily` components.
        - Consecutive children *without* their own children are grouped and rendered within a `ChildrenBox` component.
    - The `ChildrenBox` component uses `display: grid` with a single column (`grid-template-columns: auto`) to render its items vertically.
    - This creates a mixed horizontal (for groups) and vertical (within non-parent groups) layout.

### CSS Organization

- Use CSS modules for component-specific styling and layout
  - Each component has its own `.module.css` file
  - CSS modules handle component layout and positioning
  - Example: `ItemFamily.module.css` defines the layout for the ItemFamily component

- Use Tailwind CSS for utility classes and styling
  - Tailwind handles colors, typography, spacing, etc.
  - Example: `className="bg-card p-2 shadow-sm border text-sm"`

- Follow the color usage rules:
  - Always use semantic color variables (e.g., `bg-background`, `text-foreground`)
  - Never use direct color classes (e.g., `bg-slate-100`)
  - Define new colors in `app.css` using CSS variables

- Use the `cn` utility function to combine class names
  - Example: `cn(styles.layout, props.className)`

### State Management

- Use React Router's data APIs for state management
  - `clientLoader`: Loads the initial state from storage
  - `clientAction`: Handles state mutations (update, delete)
  - These functions connect UI components to the domain services

- Use `useFetcher` for triggering actions and accessing updated data
  - Each component uses its own fetcher instance
  - Fetchers handle optimistic UI updates

- Submit changes to the server via fetchers with the appropriate method:
  - `PUT` for updates and creations
  - `DELETE` for deletions
  - Example:

    ```typescript
    fetcher.submit(newItem, {
      method: "PUT",
      encType: "application/json",
    });
    ```

## Data Flow Patterns

### Item Creation Flow (Seamless Addition)

1. User clicks on an existing `ItemCard` to edit, or finishes editing a card.
2. If the user saves a non-empty description for the item currently marked by `addingItemId` context:
    a. The updated item is saved (via `PUT` request).
    b. A *new*, empty `Item` is created immediately after the saved item using `createNewItem()`.
    c. The parent's children array is updated to include both the saved item and the new empty item.
    d. The `addingItemId` context is updated to the ID of the *new* empty item.
    e. The updated parent (with both items) is submitted via fetcher (`PUT`).
    f. The UI focuses the textarea for the new empty item, allowing immediate typing.
3. If the user saves an empty description for the item marked by `addingItemId`, the item is deleted (`DELETE` request) and `addingItemId` is cleared.

### Item Update Flow

1. User edits an item (clicks on it to enter edit mode)
2. User types new content in the textarea
3. On blur or Enter key, the updated item is submitted to the server via fetcher
4. Server uses `updateItem` to recursively update the item in the tree
5. Updated map is saved to storage
6. Updated map is returned to the client

### Item Deletion Flow

1. User deletes an item (via context menu or Backspace key)
2. Item is submitted to the server via fetcher with DELETE method
3. Server uses `deleteItem` to recursively remove the item from the tree
4. Updated map is saved to storage
5. Updated map is returned to the client

### Drag and Drop Flow

1. User starts dragging an item (`useStartCardInsert`).
2. `ItemFamily` uses different acceptor components based on its `isExpanded` state:
    - If collapsed: `VerticalDropAcceptor` is used, allowing drops above/below the item.
    - If expanded: `HorizontalDropAcceptor` is used, allowing drops between the horizontally arranged child groups (but not directly *into* the parent).
3. `useAcceptCardInsert` hook handles drag over, leave, and drop events.
4. Visual indicators show potential drop positions.
5. On drop, `moveItem` service is eventually called (via fetcher `PUT` request) with source and target information.
6. Server saves the updated map to storage.
7. Updated map is returned to the client.

### Clipboard Operations Flow

1. User copies an item (via context menu)
2. `copyItemToClipboard` serializes the item to Markdown or HTML
3. Content is copied to the system clipboard
4. When pasting, `getChildFromClipboard` parses clipboard content
5. Parsed items are added to the target parent
6. Updated parent is submitted to the server via fetcher

## Testing Patterns

- Tests are co-located with the code they test
  - Example: `services/index.test.ts` tests the functions in `services/index.ts`

- Use Vitest for testing
  - Tests are run with `npm run test:unit`

- Test pure functions in isolation
  - Services are tested independently of UI components
  - Example: Testing `updateItem`, `deleteItem`, etc.

- Focus on testing core domain logic
  - Ensure that tree operations work correctly
  - Test edge cases like empty trees, deep nesting, etc.

- Use test utilities for common setup
  - Example: `test-utils.ts` provides helper functions for tests

## Known Challenges

1. **Performance with Large Trees**:
   - Recursive operations can be expensive for deeply nested trees
   - Each operation traverses the entire tree, which can be slow for large trees
   - No virtualization for rendering large trees

2. **Browser Storage Limitations**:
   - Browser storage quotas limit the amount of data that can be stored
   - LocalForage uses IndexedDB when available, but falls back to localStorage
   - No mechanism to warn users when approaching storage limits

3. **Single Document Limitation**:
   - Currently only supports a single document/map at a time
   - No way to switch between multiple maps
   - No document management interface

4. **Limited Export Options**:
   - Export is limited to clipboard operations
   - No direct file export/import
   - No support for exporting to other formats like PDF

## User Preferences

- Maintain the clean, minimalist UI
  - Focus on content rather than UI elements
  - Use subtle visual cues for interactions

- Preserve the hierarchical visualization of items
  - Clear parent-child relationships
  - Visual distinction between items and their children

- Keep the Markdown integration for interoperability with other tools
  - Markdown as the primary exchange format
  - HTML support for richer content when needed

- Support keyboard shortcuts for power users
  - Expand/collapse with Ctrl+E/Cmd+E
  - Delete with Backspace
  - Submit edits with Enter

## Evolution of Project Decisions

- The project started with a focus on simplicity and local storage
  - Local-first approach prioritizes privacy and offline use
  - No server dependencies for core functionality

- The hierarchical structure evolved to support both horizontal and vertical layouts
  - Items can be expanded to show children in a nested structure
  - This provides flexibility in how users organize their thoughts

- Clipboard integration expanded to support both Markdown and HTML
  - Markdown for plain text interoperability
  - HTML for richer formatting when available

- React Router's data APIs for state management has worked well
  - Leverages the routing library for data handling
  - Avoids the need for additional state management libraries
  - Provides a clean separation between UI and data operations

## Tool Usage Patterns

- Use `npm run dev` for local development
  - Starts the Vite development server
  - Provides hot module replacement for fast development

- Use `npm run validate` to check for linting, type, and test errors
  - Runs Biome linting, TypeScript type checking, and Vitest tests
  - Good to run before committing changes

- Use `npm run build` and `npm run deploy` for production deployment
  - Builds the project for production
  - Deploys to Cloudflare Workers

- Use `npm run test:unit` for running tests with UI
  - Provides a visual interface for test results
  - Allows for filtering and focusing tests

## Remember

- Always follow the immutability pattern when working with the item tree
  - Never mutate objects directly
  - Always create new objects with the desired changes

- Use recursive functions for tree operations
  - Handle both the base case and recursive case
  - Return unchanged objects when no changes are needed

- Keep the UI clean and focused on content creation
  - Minimize UI elements that distract from content
  - Use subtle visual cues for interactions

- Maintain the Markdown and HTML integration for interoperability
  - Support both formats for clipboard operations
  - Ensure proper parsing and serialization

- Follow the domain-driven design approach
  - Define models first
  - Implement services as pure functions
  - Use repositories for storage operations

## HTML Serialization Patterns

### Compact HTML Output

The project generates compact HTML without whitespace for efficiency:

- **No newlines or indentation** in HTML output from `richtext.ts`
- Compact representation: `<ul><li>Item 1</li><li>Item 2<ul><li>Item 2.1</li></ul></li></ul>`
- Parser remains whitespace-tolerant when reading input HTML

This approach optimizes storage and transmission while maintaining compatibility with various input formats. Used for clipboard operations and data exchange.
