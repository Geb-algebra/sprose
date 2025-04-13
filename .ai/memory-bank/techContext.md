# Technical Context

## Technology Stack

### Frontend Framework

- **React 19**: The latest version of React is used for building the user interface
- **React Router 7**: Used for routing and state management with its data APIs
- **TypeScript 5.7**: For type safety and better developer experience

### Styling

- **Tailwind CSS 4**: For utility-based styling
- **CSS Modules**: For component-specific styling
- **CSS Variables**: For theming and consistent styling

### Storage

- **LocalForage**: A library that improves on localStorage with async storage and better browser support
- Used for persisting user data in the browser

### Server

- **Hono**: A small, simple, and ultrafast web framework for Cloudflare Workers
- Used for handling API requests and serving the application

### Build Tools

- **Vite 6**: For fast development and optimized production builds
- **TypeScript 5.7**: For static type checking
- **Biome 1.9.4**: For linting and formatting

### Testing

- **Vitest 3**: For unit and integration testing
- Tests are co-located with the code they test

### Deployment

- **Cloudflare Workers**: For serverless deployment
- **Wrangler**: CLI tool for deploying to Cloudflare Workers

### UI Components

- **shadcn/ui**: UI components manually copied from the shadcn/ui website
- Not installed via CLI, but manually integrated

## Development Environment

### Required Tools

- Node.js (latest LTS version recommended)
- npm or pnpm for package management
- Git for version control

### Development Workflow

1. Clone the repository
2. Install dependencies with `npm install` or `pnpm install`
3. Start the development server with `npm run dev`
4. Make changes to the code
5. Run tests with `npm run test:unit`
6. Check for linting and type errors with `npm run validate`
7. Build for production with `npm run build`
8. Deploy to Cloudflare Workers with `npm run deploy`

### NPM Scripts

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

## Key Files

### Configuration Files

- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite configuration
- `vitest.config.ts`: Vitest configuration
- `biome.json`: Biome linting and formatting configuration
- `wrangler.toml`: Cloudflare Workers configuration

### Core Application Files

- `app/map/models/index.ts`: Core data models and schemas
- `app/map/lifecycle/index.ts`: Item lifecycle management
- `app/map/services/index.ts`: Services for manipulating items
- `app/routes/_index/route.tsx`: Main page component
- `app/routes/_index/ItemFamily.tsx`: Component for rendering an item and its children
- `app/routes/_index/Item.tsx`: Component for rendering an individual item

## Technical Constraints

### Browser Storage Limitations

- LocalForage uses IndexedDB, WebSQL, or localStorage depending on browser support
- Storage is limited by browser quotas (typically 5-10MB for localStorage, more for IndexedDB)
- All data is stored locally, with no server-side persistence

### Performance Considerations

- Recursive tree operations can be expensive for deeply nested trees
- Immutable updates create new objects, which can impact memory usage
- Drag and drop operations need to be optimized for smooth user experience

### Browser Compatibility

- The application targets modern browsers with good support for:
  - ES6+ features
  - CSS Grid and Flexbox
  - HTML5 Drag and Drop API
  - IndexedDB or localStorage

### Cloudflare Workers Limitations

- Limited execution time (CPU time limits)
- Memory limits (128MB per worker)
- No access to the file system
- Stateless execution model

## Dependencies

### Core Dependencies

- `react`: UI library
- `react-router-dom`: Routing and data APIs
- `localforage`: Browser storage
- `zod`: Runtime type validation
- `lucide-react`: Icon library

### Development Dependencies

- `typescript`: Static type checking
- `vite`: Build tool
- `vitest`: Testing framework
- `@biomejs/biome`: Linting and formatting
- `wrangler`: Cloudflare Workers CLI

## Coding Standards

### TypeScript

- Strict type checking is enabled
- Interfaces and types are defined for all data structures
- Zod schemas are used for runtime validation

### CSS

- CSS modules for component-specific styling
- Tailwind CSS for utility classes
- Semantic color variables for theming
- Dark mode support

### Component Structure

- Functional components with hooks
- Props are typed with TypeScript interfaces
- CSS modules are co-located with components

### Testing

- Unit tests for core functionality
- Tests are co-located with the code they test
- Tests are run with Vitest
