# Active Context

## Current Focus

The current focus is on stabilizing and refining the recently implemented features, particularly the redesigned card addition flow and the new layout. Alongside this, ongoing maintenance and enhancement of the core hierarchical item management system continue.

## Recent Changes

Significant recent updates include:

1.  **Redesigned Card Addition Flow**: Implemented a new mechanism for inserting cards that supports seamless creation of multiple cards.
2.  **Layout Overhaul**: Introduced substantial layout improvements for a better card arrangement and user experience.
3.  **Collapse Feature**: Completed the implementation of expand/collapse functionality for item trees.

These are in addition to the previously stable core features:

*   **Hierarchical Item Management**: Creating, editing, deleting, organizing items.
*   **Drag and Drop**: Moving and reordering items.
*   **Clipboard Integration**: Copy/paste as Markdown and HTML.
*   **History Management**: Undo/redo functionality.

## Active Decisions

1.  **New Layout and Card Arrangement**: Adopted a new visual layout and card arrangement pattern to improve usability.
2.  **Seamless Card Addition**: Implemented a specific workflow for adding new cards consecutively.
3. **Local Storage Only**
   - The application currently uses browser local storage (via LocalForage) for data persistence
   - No server-side storage or synchronization is implemented
   - This decision prioritizes simplicity and privacy but limits data sharing across devices

4. **Markdown and HTML as Exchange Formats**
   - Markdown is used as the primary format for copying and pasting items
   - HTML is supported as a fallback format for clipboard operations
   - This enables interoperability with other text editors and note-taking applications
   - The application can parse both Markdown lists and HTML lists into the item tree structure

5. **Immutable Data Patterns**
   - All operations on the item tree create new objects rather than mutating existing ones
   - This ensures predictable state management and supports the history feature
   - Services like updateItem, deleteItem, and moveItem all follow this pattern

6. **React Router for State Management**
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

Based on the current state and recent changes, the immediate next steps involve:

1.  **Refining New Features**: Stabilizing and polishing the redesigned card addition flow and new layout.
2.  **Enhanced Export/Import**: Adding direct file export/import functionality.
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
