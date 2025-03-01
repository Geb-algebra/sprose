# Project Intelligence for Sprose

This document captures important patterns, preferences, and project intelligence for the Sprose application. It serves as a learning journal to help work more effectively with the project.

## Code Organization Patterns

### Domain-Driven Design

The project follows a domain-driven design approach with a clear separation of concerns:

1. **Define Domain Models First**: Always start by defining domain models and validators in `app/map/models/`.
2. **Create Factory Functions**: Use factory functions like `createNewItem` to encapsulate object creation.
3. **Implement Services as Pure Functions**: Services should be pure functions that don't mutate their inputs.
4. **Use Repository Pattern for Storage**: The `MapRepository` class handles all storage operations.

### Immutability Pattern

All operations on domain objects must follow an immutability pattern:

- Never mutate domain object instances passed as arguments
- Always create and return new instances with the desired changes
- Use the spread operator for shallow copies and map/filter for array operations
- Example: `{ ...item, children: [...item.children, newChild] }`

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

## UI Patterns

### Component Hierarchy

- **Page**: Top-level container for the entire application
- **ItemFamily**: Container for an item and its children
- **ItemCard**: Individual item display and editing
- **AddItemButton**: Button for adding new items

### CSS Organization

- Use CSS modules for component-specific styling
- Use Tailwind CSS for utility classes
- Follow the color usage rules:
  - Always use semantic color variables (e.g., `bg-background`, `text-foreground`)
  - Never use direct color classes (e.g., `bg-slate-100`)
  - Define new colors in `app.css` using CSS variables

### State Management

- Use React Router's data APIs for state management
- Use `useFetcher` for triggering actions and accessing updated data
- Submit changes to the server via fetchers with the appropriate method:
  - `PUT` for updates
  - `DELETE` for deletions

## Data Flow Patterns

### Item Creation Flow

1. User clicks "Add Item" button
2. `createNewItem` factory function creates a new item
3. Parent's children array is updated with the new item
4. Updated parent is submitted to the server via fetcher
5. Server saves the updated map to storage

### Item Update Flow

1. User edits an item
2. Updated item is submitted to the server via fetcher
3. Server uses `updateItem` to recursively update the item in the tree
4. Updated map is saved to storage
5. Updated map is returned to the client

### Item Deletion Flow

1. User deletes an item
2. Item is submitted to the server via fetcher with DELETE method
3. Server uses `deleteItem` to recursively remove the item from the tree
4. Updated map is saved to storage
5. Updated map is returned to the client

### Drag and Drop Flow

1. User starts dragging an item
2. `useStartCardInsert` hook handles drag start
3. `useAcceptCardInsert` hook handles drag over, leave, and drop events
4. On drop, `moveItem` is called with source and target information
5. Updated map is submitted to the server via fetcher
6. Server saves the updated map to storage

## Testing Patterns

- Tests are co-located with the code they test
- Use Vitest for testing
- Test pure functions in isolation
- Focus on testing core domain logic

## Known Challenges

1. **Performance with Large Trees**: Recursive operations can be expensive for deeply nested trees.
2. **Browser Storage Limitations**: Browser storage quotas limit the amount of data that can be stored.
3. **Single Document Limitation**: Currently only supports a single document/map at a time.

## User Preferences

- Maintain the clean, minimalist UI
- Preserve the hierarchical visualization of items
- Keep the Markdown integration for interoperability with other tools

## Evolution of Project Decisions

- The project started with a focus on simplicity and local storage
- Future directions include enhanced export/import, performance optimizations, and potentially collaboration features
- The decision to use React Router's data APIs for state management has worked well and should be maintained

## Tool Usage Patterns

- Use `npm run dev` for local development
- Use `npm run validate` to check for linting, type, and test errors
- Use `npm run build` and `npm run deploy` for production deployment

## Remember

- Always follow the immutability pattern when working with the item tree
- Use recursive functions for tree operations
- Keep the UI clean and focused on content creation
- Maintain the Markdown integration for interoperability
