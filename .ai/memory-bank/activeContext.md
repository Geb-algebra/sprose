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

3. **Clipboard Integration**
   - Copying items as Markdown
   - Pasting Markdown as new items

4. **History Management**
   - Undo/redo functionality
   - History stack limited to 100 entries

## Active Decisions

1. **Local Storage Only**
   - The application currently uses browser local storage (via LocalForage) for data persistence
   - No server-side storage or synchronization is implemented
   - This decision prioritizes simplicity and privacy but limits data sharing across devices

2. **Markdown as Exchange Format**
   - Markdown is used as the primary format for copying and pasting items
   - This enables interoperability with other text editors and note-taking applications
   - The application can parse Markdown lists into the item tree structure

3. **Immutable Data Patterns**
   - All operations on the item tree create new objects rather than mutating existing ones
   - This ensures predictable state management and supports the history feature

4. **React Router for State Management**
   - React Router's data APIs are used for state management
   - This approach leverages the routing library for data handling, avoiding the need for additional state management libraries

## Current Challenges

1. **Performance with Large Trees**
   - Recursive operations on deeply nested trees could become performance bottlenecks
   - Large history stacks might consume significant memory

2. **Limited Export Options**
   - Currently, export is limited to clipboard operations
   - No direct file export functionality is implemented

3. **Browser Storage Limitations**
   - Browser storage quotas limit the amount of data that can be stored
   - No fallback mechanism for when storage limits are reached

## Next Steps

Based on the current state of the project, potential next steps could include:

1. **Enhanced Export/Import**
   - Add direct file export/import functionality
   - Support additional formats beyond Markdown

2. **Performance Optimizations**
   - Optimize recursive tree operations for better performance with large trees
   - Implement virtualization for rendering large trees

3. **Collaboration Features**
   - Add real-time collaboration capabilities
   - Implement server-side storage and synchronization

4. **Enhanced Editing**
   - Add rich text editing capabilities
   - Support for images and other media types

5. **Mobile Support**
   - Optimize the user interface for mobile devices
   - Implement touch-friendly interactions

## Current Development Environment

The project is set up with a modern development environment:

- Vite for fast development and optimized production builds
- TypeScript for type safety
- Biome for linting and formatting
- Vitest for testing
- React Router for routing and data management
- Tailwind CSS and CSS Modules for styling

## Deployment Strategy

The application is designed to be deployed to Cloudflare Workers, providing:

- Global distribution
- Low latency
- Serverless architecture
- Easy deployment with Wrangler
