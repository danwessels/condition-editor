# Condition Editor

A React application for filtering and displaying products with dynamic condition-based queries. Users can filter products by selecting properties, operators, and values.

## Features

- **Dynamic Product Filtering**: Filter products using customisable conditions
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
- npm (this guide provides npm commands, but you can use Yarn equivalents)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd salsify-condition-editor
```

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

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Select.tsx
│   └── __tests__/
├── features/
│   └── Products/        # Main product filtering feature
│       ├── context.ts   # React Context for state management
│       ├── reducer.ts   # State reducer logic
│       ├── utils.ts     # Utility functions
│       └── components/  # Feature-specific components
├── mockApi/            # Mock data 
├── types/              # TypeScript type definitions
└── styles.css         # Global styles
```

## How It Works

The application uses a mock datastore to simulate product data with properties and filtering capabilities. Users can:

1. **Select a Property**: Choose from available product properties
2. **Choose an Operator**: Pick an appropriate comparison operator based on property type
3. **Set Values**: Enter or select values to see filtered results in real-time
