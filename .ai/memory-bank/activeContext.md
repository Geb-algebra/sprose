# Active Context

## Current Focus

The current focus of the Sprose project is on maintaining and enhancing the core functionality of the hierarchical item management system. The application allows users to create, edit, move, and organize items in a tree structure, with support for copying and pasting items as Markdown or HTML.

## Recent Changes

Based on the code examined, the project appears to be in a stable state with the following core features implemented:

1. **Hierarchical Item Management**
   - Creating, editing, and deleting items
   - Organizing items in a tree structure
   - Expanding/collapsing item trees

2. **Drag and Drop**
   - Moving items between different parents
   - Reordering items within the same parent
   - Visual indicators for drop targets

3. **Clipboard Integration**
   - Copying items as Markdown or HTML
   - Pasting Markdown or HTML as new items
   - System clipboard integration

4. **History Management**
   - Undo/redo functionality
   - History stack limited to 100 entries

## Active Decisions

1. **Local Storage Only**
   - The application currently uses browser local storage (via LocalForage) for data persistence
   - No server-side storage or synchronization is implemented
   - This decision prioritizes simplicity and privacy but limits data sharing across devices

2. **Markdown and HTML as Exchange Formats**
   - Markdown is used as the primary format for copying and pasting items
   - HTML is supported as a fallback format for clipboard operations
   - This enables interoperability with other text editors and note-taking applications
   - The application can parse both Markdown lists and HTML lists into the item tree structure

3. **Immutable Data Patterns**
   - All operations on the item tree create new objects rather than mutating existing ones
   - This ensures predictable state management and supports the history feature
   - Services like updateItem, deleteItem, and moveItem all follow this pattern

4. **React Router for State Management**
   - React Router's data APIs (clientLoader, clientAction) are used for state management
   - The useFetcher hook is used for triggering actions and accessing updated data
   - This approach leverages the routing library for data handling, avoiding the need for additional state management libraries

## Current Challenges

1. **Performance with Large Trees**
   - Recursive operations on deeply nested trees could become performance bottlenecks
   - Large history stacks might consume significant memory
   - No virtualization for rendering large trees

2. **Limited Export Options**
   - Currently, export is limited to clipboard operations
   - No direct file export functionality is implemented
   - No bulk export/import of multiple items

3. **Browser Storage Limitations**
   - Browser storage quotas limit the amount of data that can be stored
   - No fallback mechanism for when storage limits are reached
   - No data backup mechanism beyond the browser's local storage

## Next Steps

Based on the current state of the project, potential next steps could include:

1. **Enhanced Export/Import**
   - Add direct file export/import functionality
   - Support additional formats beyond Markdown and HTML
   - Implement bulk export/import of multiple items

2. **Performance Optimizations**
   - Optimize recursive tree operations for better performance with large trees
   - Implement virtualization for rendering large trees
   - Add lazy loading for deeply nested items

3. **Multiple Documents**
   - Support for multiple maps/documents
   - Document management interface
   - Templates for common use cases

4. **Search and Filtering**
   - Add search functionality to find items by content
   - Implement filtering options to show/hide items based on criteria
   - Add tagging and categorization

5. **Enhanced Editing**
   - Add rich text editing capabilities
   - Support for images and other media types
   - More formatting options beyond plain text

6. **Collaboration Features**
   - Add real-time collaboration capabilities
   - Implement server-side storage and synchronization
   - Add user authentication and authorization
   - Create sharing capabilities

7. **Mobile Support**
   - Optimize the user interface for mobile devices
   - Implement touch-friendly interactions
   - Add Progressive Web App (PWA) capabilities
   - Improve offline support

## Current Development Environment

The project is set up with a modern development environment:

- Vite 6 for fast development and optimized production builds
- TypeScript 5.7 for type safety
- Biome 1.9.4 for linting and formatting
- Vitest 3 for testing
- React Router 7 for routing and data management
- Tailwind CSS 4 and CSS Modules for styling
- Hono for the server (Cloudflare Workers)

## Deployment Strategy

The application is designed to be deployed to Cloudflare Workers, providing:

- Global distribution
- Low latency
- Serverless architecture
- Easy deployment with Wrangler
- No server-side state management required
