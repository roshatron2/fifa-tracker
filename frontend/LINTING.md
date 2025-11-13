# Linting and Code Quality Guide

This document outlines the linting setup and code quality practices for the FIFA Tracker project.

## Available Scripts

### Linting Commands

- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Run ESLint and automatically fix issues where possible
- `npm run lint:check` - Run ESLint with zero tolerance for warnings (fails on warnings)

### Type Checking

- `npm run type-check` - Run TypeScript compiler to check for type errors
- `npm run type-check:watch` - Run TypeScript compiler in watch mode

### Combined Quality Checks

- `npm run code-quality` - Run both linting and type checking

## Automatic Linting

### VS Code Integration

- **Format on Save**: Automatically formats code when you save files
- **ESLint Auto-fix**: Automatically fixes ESLint issues on save
- **Import Organization**: Automatically organizes imports on save

## ESLint Rules

### TypeScript Rules

- `@typescript-eslint/no-unused-vars`: Error on unused variables (ignores variables starting with `_`)
- `@typescript-eslint/no-explicit-any`: Error on explicit `any` types
- `@typescript-eslint/prefer-const`: Error when `let` is used but never reassigned

### React Rules

- `react-hooks/exhaustive-deps`: Warn about missing dependencies in useEffect
- `react/no-unescaped-entities`: Warn about unescaped HTML entities

### General Rules

- `prefer-const`: Error when `let` is used but never reassigned
- `no-var`: Error on `var` usage (use `const` or `let`)
- `no-console`: Warn about console statements (use proper logging in production)

## Code Formatting

### Prettier Configuration

- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Line Length**: 80 characters maximum
- **Indentation**: 2 spaces
- **Trailing Commas**: ES5 compatible

## Best Practices

### Before Committing

1. Run `npm run code-quality` to check for issues
2. Fix any linting errors or warnings
3. Ensure TypeScript compilation passes
4. Format code with Prettier

### Common Issues and Solutions

#### Unused Variables

```typescript
// ❌ Bad
const unusedVar = 'something';

// ✅ Good - Remove if not needed
// const unusedVar = 'something';

// ✅ Good - Prefix with underscore if intentionally unused
const _unusedVar = 'something';
```

#### Explicit Any Types

```typescript
// ❌ Bad
const data: any = response.data;

// ✅ Good - Use proper types
const data: ApiResponse = response.data;

// ✅ Good - Use Record for object types
const data: Record<string, unknown> = response.data;
```

#### Let vs Const

```typescript
// ❌ Bad
let finalPlayerIds = [...player_ids];

// ✅ Good
const finalPlayerIds = [...player_ids];
```

## IDE Setup

### Required VS Code Extensions

- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Tailwind CSS IntelliSense

### Recommended Settings

The `.vscode/settings.json` file is already configured with optimal settings for this project.

## Continuous Integration

The build process automatically runs linting and type checking. If any issues are found, the build will fail, ensuring code quality in production deployments.

## Troubleshooting

### Common Issues

1. **ESLint not working in VS Code**
   - Ensure ESLint extension is installed
   - Restart VS Code
   - Check if there are any ESLint configuration errors

2. **Prettier conflicts with ESLint**
   - The configuration is set up to work together
   - If conflicts occur, run `npm run lint:fix` to resolve

3. **TypeScript errors not showing**
   - Ensure TypeScript extension is installed
   - Run `npm run type-check` to see all errors
   - Check `tsconfig.json` configuration

### Getting Help

- Check the ESLint documentation: https://eslint.org/
- Check the Prettier documentation: https://prettier.io/
- Check the TypeScript documentation: https://www.typescriptlang.org/
