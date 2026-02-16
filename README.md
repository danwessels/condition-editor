# Condition Editor

A React application for filtering and displaying data based on dynamic condition-based queries. Users can filter data by selecting properties, operators, and values.

## Features

- **Dynamic Filtering**: Filter data using customisable conditions
- **Flexible Operators**: Support for various comparison operators (equals, contains, greater than, etc.)
- **Responsive Design**: Clean, responsive UI built with Tailwind CSS

## Tech Stack

- **React 19** with hooks and Context API for state management
- **TypeScript** for type safety and better developer experience
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Select** for enhanced dropdown components
- **Jest** and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

1. Navigate to the root folder of the repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Useful Scripts

- `npm run dev` - Start the development server
- `npm run test` - Run the test suite

## How It Works

The application uses a comet data from NASA to demonstrate the capabilities of a condition editor with properties and filtering capabilities. Users can:

1. **Select a Property**: Choose from available properties
2. **Choose an Operator**: Pick an appropriate comparison operator based on property type
3. **Set Values**: Enter or select values to see filtered results in real-time

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Select.tsx
│   └── __tests__/
├── features/
│   └── DataView/        # Main filtering feature
│       ├── context.ts   # React Context for state management
│       ├── reducer.ts   # State reducer logic
│       ├── utils.ts     # Utility functions
│       └── components/  # Feature-specific components
├── data/            # Data from NASA
├── types/              # TypeScript type definitions
└── styles.css         # Global styles
```

## Technical Approach

**Architecture Decisions:**
- **React Context + Reducer Pattern**: Chose this over external state management (Redux/Zustand) for simplicity. The reducer pattern provides predictable state updates and is easy to test.
- **TypeScript Throughout**: Comprehensive type safety to catch errors early and improve developer experience
- **Component Composition**: Built reusable components (`Button`, `Select`) that can be used in more complex features
- **Feature-based Organization**: Grouped related functionality in the `features/DataView` or `features/OrbitVisualisation` directory for better maintainability

**Key Implementation Choices:**
- **Property-driven UI**: The interface dynamically adapts based on selected property types, showing appropriate operators and value inputs
- **Comprehensive Testing**: Added unit tests for components, reducers, and utilities to ensure reliability

**Development Process:**
1. Started with understanding the data structure and requirements
2. Planned the architecture and set up the project
3. Built the core filtering logic and state management first
5. Implemented the main filtering interface
6. Added edge case handling
7. Comprehensive testing (AI-assisted to speed up the process)

### Challenges and Solutions

- **Dynamic Operator Selection**: Different property types require different operators. Solved by creating a mapping system in `utils.ts`
- **Type Safety with Dynamic Data**: Used TypeScript discriminated unions to maintain type safety while handling different property types
- **Prioritising core features**: To manage my time effectively (with an aim to complete the project and give a well-rounded idea of my capabilities), I had to decide what to focus on and what to leave out

### Time spent

Approximately 16 - 18 hours (with AI assistance primarily for tests, small autocompletions, and assistance with orbit visualisations).

### Current limitations

In future, I'd like to:
- Provide context/explanations for each of the filterable fields so they're more meaningful/accessible to the average person
- Improve the visualisation of the comets' paths (it's currently quite rudimentary)
