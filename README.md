# Todo Application - Interview Challenge

A sophisticated task management application built with React, TypeScript, and Tailwind CSS, demonstrating advanced software engineering principles and design patterns.

## 🚀 Features

### Core Functionality
- **Todo Management**: CRUD operations with real-time updates
- **Advanced Filtering**: Filter by status (All, Completed, Pending)
- **Real-time Search**: Debounced search functionality
- **Drag & Drop**: Reorder todos with smooth animations
- **Progress Tracking**: Visual progress indicators
- **Responsive Design**: Mobile-first approach

### Technical Excellence
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with RTK Query
- **Data Fetching**: React Query for server state
- **Form Validation**: Zod schema validation
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Optimized rendering and caching

## 🏗️ Architecture & Design Patterns

### 1. **MVC (Model-View-Controller) Pattern**
```
Model:     Types, Validation Schemas, Redux Store
View:      React Components, UI Layer
Controller: Services, API Layer, Custom Hooks
```

### 2. **Repository Pattern**
- **Service Layer**: `todoService.ts` abstracts API calls
- **Data Mapping**: `mapper.ts` handles data transformation
- **API Proxy**: `apiProxy.ts` centralizes HTTP operations

### 3. **Observer Pattern**
- Redux store subscriptions
- React Query cache invalidation
- Event-driven state updates

### 4. **Factory Pattern**
- Component factories for dynamic UI generation
- Service factory for API endpoint management

### 5. **Strategy Pattern**
- Different filtering strategies
- Multiple validation approaches
- Various error handling strategies

### 6. **Decorator Pattern**
- Higher-order components (HOCs)
- Custom hooks as decorators
- Middleware for API calls

## 🎯 SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**
```typescript
// Each service has one responsibility
todoService.ts - Todo operations only
apiProxy.ts - HTTP operations only
mapper.ts - Data transformation only
```

### 2. **Open/Closed Principle (OCP)**
```typescript
// Extensible without modification
interface TodoService {
  getTodos(): Promise<Todo[]>;
  addTodo(todo: CreateTodoDto): Promise<Todo>;
  // Easy to extend with new methods
}
```

### 3. **Liskov Substitution Principle (LSP)**
```typescript
// Components can be substituted
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### 4. **Interface Segregation Principle (ISP)**
```typescript
// Specific interfaces for specific needs
interface TodoFilters {
  status?: TodoStatus;
  search?: string;
}

interface TodoActions {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### 5. **Dependency Inversion Principle (DIP)**
```typescript
// Depend on abstractions, not concretions
const useTodoService = () => {
  return {
    getTodos: () => todoService.getTodos(),
    addTodo: (todo: CreateTodoDto) => todoService.addTodo(todo),
  };
};
```

## 🎨 Design System & Component Architecture

### Component Hierarchy
```
App
├── TodoApp
│   ├── AddTodoForm
│   ├── TodoFilters
│   ├── TodoList
│   │   └── TodoItem[]
│   └── ProgressBar
└── ErrorBoundary
```

### Base Components (Atomic Design)
```
atoms/
├── Button
├── Input
├── Badge
├── Spinner
└── Card

molecules/
├── TodoItem
├── AddTodoForm
└── TodoFilters

organisms/
├── TodoList
└── TodoApp
```

### Style Guide

#### Color Palette
```css
Primary: #3B82F6 (Blue-500)
Secondary: #6B7280 (Gray-500)
Success: #10B981 (Green-500)
Warning: #F59E0B (Yellow-500)
Error: #EF4444 (Red-500)
Background: #F9FAFB (Gray-50)
```

#### Typography
```css
Heading: Inter, 24px, font-weight: 600
Body: Inter, 16px, font-weight: 400
Caption: Inter, 14px, font-weight: 400
```

#### Spacing System
```css
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px
```

## 🔧 Technical Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript 5.0+** - Type-safe development
- **Vite** - Fast build tool and dev server

### State Management
- **Redux Toolkit** - Predictable state management
- **React Query** - Server state management
- **RTK Query** - API state management

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Scoped styling
- **Framer Motion** - Animation library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── base/           # Atomic components
│   ├── icons/          # SVG icons
│   └── page/           # Page-specific components
├── hooks/              # Custom React hooks
├── services/           # Business logic layer
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── plugin/             # Third-party integrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd todo-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Service layer testing
- Utility function testing

### Integration Tests
- API integration testing
- State management testing
- User interaction testing

### E2E Tests
- Complete user journey testing
- Cross-browser compatibility

## 📊 Performance Optimizations

### React Optimizations
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for stable references
- Lazy loading for code splitting

### State Management
- Selective subscriptions
- Optimistic updates
- Efficient re-renders

### API Optimization
- Request deduplication
- Intelligent caching
- Background refetching

## 🔒 Security Considerations

- Input validation with Zod
- XSS prevention
- CSRF protection
- Secure HTTP headers

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   # Small devices
md: 768px   # Medium devices
lg: 1024px  # Large devices
xl: 1280px  # Extra large devices
```

### Mobile-First Approach
- Touch-friendly interactions
- Optimized for mobile performance
- Progressive enhancement

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Monitoring & Analytics

- Error tracking with Error Boundaries
- Performance monitoring
- User interaction analytics
- API performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author
Fattah Behmadi

---

**Note**: This project demonstrates advanced React patterns, TypeScript best practices, and scalable architecture suitable for enterprise-level applications.
