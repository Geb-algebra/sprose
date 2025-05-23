# Sprose Project Structure and Coding Rules

## Project Overview

Sprose is a tool to spread users thoughts by writing what they think on many cards and organize these cards hierarchically to clarify what the users think.
It helps users to write drafts of articles, user story maps, plannings etc.
It built with React Router v7 and designed to be deployed to Cloudflare Workers. It allows users to create, edit, move, and organize items in a tree structure, with support for copying and pasting items as Markdown or HTML.

## Technology Stack

- **Frontend Framework**: React 19
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Server**: Hono (for Cloudflare Workers)
- **Storage**: LocalForage (browser storage)
- **Build Tool**: Vite 6
- **Testing**: Vitest 3
- **Type Checking**: TypeScript 5.7
- **Linting/Formatting**: Biome 1.9.4
- **UI Components**: shadcn/ui but manually copy&pasted from its website, not installed via cli.

## Project Structure

```
/
├── app/                      # Main application code
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── map/                  # Core application logic
│   │   ├── hooks/            # Map-specific hooks
│   │   ├── lifecycle/        # Item lifecycle management
│   │   ├── models/           # Data models and schemas
│   │   └── services/         # Services for manipulating items
│   ├── routes/               # Application routes
│   │   ├── _index/           # Main page
│   │   └── control/          # Control panel
│   └── utils/                # Utility functions
├── public/                   # Static assets
└── build/                    # Build output
```

## Core Features

1. **Hierarchical Item Management**
   - Create, edit, and delete items
   - Organize items in a tree structure
   - Expand/collapse item trees

2. **Drag and Drop**
   - Move items between different parents
   - Reorder items within the same parent

3. **Clipboard Integration**
   - Copy items as Markdown or HTML
   - Paste Markdown or HTML as new items
   - System clipboard integration (Ctrl+C/Cmd+C, Ctrl+V/Cmd+V)

4. **History Management**
   - Undo/redo functionality
   - Keyboard shortcuts (Ctrl+Z/Cmd+Z, Ctrl+Shift+Z/Cmd+Shift+Z)

## Key Components

### Data Model

The core data model is the `Item` type, defined in `app/map/models/index.ts`:

```typescript
export type Item = {
  id: string;
  description: string;
  isExpanded: boolean;
  children: Item[];
};
```

### Item Storage

Items are stored in the browser using LocalForage, with a history stack for undo/redo functionality:

```typescript
export type MapData = {
  mapHistory: Item[];
  currentMapIndex: number;
};
```

### UI Components

- **ItemFamily**: Renders an item and its children
- **ItemCard**: Renders an individual item
- **AddItemButton**: Button for adding new items
- **Control**: Control panel with undo/redo, copy/paste, and delete buttons

## Coding Rules and Conventions

### Domain-Driven Design Approach

The project follows a domain-driven design approach with a clear development workflow:

1. **Define Domain Objects and Validators**
   - First define domain objects (like `Item`)
   - Create validators using Zod (like `itemSchema`)
   - Example: `app/map/models/index.ts` defines the Item type and its Zod validator

2. **Create Factory and Repository Classes**
   - Define Factory classes for creating domain objects
   - Implement Repository classes for storage/retrieval operations
   - Example: `app/map/lifecycle/index.ts` contains `MapRepository` for saving/retrieving maps and `createNewItem` factory function

3. **Implement Services and UI Components**
   - Services implement domain logic (like `moveItem`, `deleteItem`)
   - UI components consume these services

4. **Immutability**
   - Services never mutate domain object instances passed as arguments
   - Instead, they create and return new instances with the desired changes
   - Example: `updateItem`, `deleteItem`, and `moveItem` in `app/map/services/index.ts` all return new objects rather than modifying the input

This pattern ensures a clean separation of concerns, maintainable code structure, and predictable state management.

### TypeScript

- Strict type checking is enabled
- Zod is used for runtime type validation
- Type definitions are co-located with their implementations

### Component Structure

- Components are organized by feature/route
- CSS modules are used for component-specific styling
- Common components are in the `app/components` directory

### Formatting and Linting

Based on the `biome.json` configuration:

- Tabs for indentation
- Line width of 100 characters
- Double quotes for strings
- Organized imports
- Recommended linting rules with some exceptions

### CSS/Styling

- CSS modules for defining layouts of an element and its children
- Tailwind CSS for styling colors and shapes of elements
- CSS variables for theming
- Dark mode support
- **Color Usage Rules**:
  - Always use semantic color variables defined in `app.css` (e.g., `bg-background`, `text-foreground`)
  - Never use direct color classes (e.g., `bg-slate-100`)
  - New colors should be defined in `app.css` using CSS variables. Define new colors only when no existing colors meet your demand.
  - This ensures consistent theming and easier dark mode support

### File Naming

- React components use PascalCase (e.g., `ItemFamily.tsx`)
- CSS modules use the same name as their component with `.module.css` extension
- Utility files use camelCase
- Test files use the same name as the file they test with `.test.ts(x)` extension

### Testing

- Tests are co-located with the code they test
- Vitest is used as the test runner
- Tests are shuffled to ensure independence

## Development Workflow

The project includes several npm scripts for development:

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run check`: Run Biome linting
- `npm run check:write`: Run Biome linting and fix issues
- `npm run typecheck`: Run TypeScript type checking
- `npm run test:unit`: Run tests with UI
- `npm run test:unit:run`: Run tests without UI
- `npm run validate`: Run linting, type checking, and tests
- `npm run deploy`: Deploy to Cloudflare Pages
- `npm run start`: Start a local Cloudflare Pages development server

## Deployment

The application is designed to be deployed to Cloudflare Workers using Wrangler:

```bash
npm run deploy
```

This will build the application and deploy it to Cloudflare Pages.


