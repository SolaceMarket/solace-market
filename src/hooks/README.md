# Onboarding Hooks - Modular Architecture

This directory contains the refactored onboarding state management system, split into focused, maintainable modules.

## File Structure

### Core Files

- **`useOnboardingState.ts`** - Main React hook that provides state and actions for the entire onboarding flow
- **`index.ts`** - Centralized export file for all onboarding hooks and utilities

### Supporting Modules

- **`onboarding-api.ts`** - API utilities and request functions
- **`onboarding-navigation.ts`** - Step navigation and progress utilities
- **`onboarding-hook-types.ts`** - TypeScript interfaces for the hook

## Usage

### Basic Usage

```typescript
import { useOnboardingState } from "@/hooks";

function OnboardingComponent() {
  const {
    user,
    loading,
    error,
    currentStep,
    saveConsents,
    saveProfile,
    // ... other actions
  } = useOnboardingState();

  // Use the state and actions...
}
```

### Using Navigation Utilities

```typescript
import { 
  getNextStep, 
  calculateProgress, 
  isStepRequired 
} from "@/hooks";

function ProgressBar() {
  const { user } = useOnboardingState();
  const progress = calculateProgress(user);
  
  return <div>Progress: {progress}%</div>;
}
```

### Direct API Access

```typescript
import { OnboardingAPI } from "@/hooks";

// Direct API calls (usually not needed - use the hook instead)
async function saveUserProfile(uid: string, profile: UserProfile) {
  return await OnboardingAPI.saveProfile(uid, profile);
}
```

## Architecture Benefits

### 🏗️ **Modular Structure**
- Each file has a single responsibility
- Easy to test individual components
- Better code organization

### 🔧 **Maintainability**
- Changes to API logic only affect `onboarding-api.ts`
- Navigation logic is isolated in `onboarding-navigation.ts`
- Type definitions are centralized

### 📦 **Reusability**
- Navigation utilities can be used independently
- API functions can be called directly when needed
- Types are shareable across components

### 🎯 **Developer Experience**
- Clear separation of concerns
- Better IDE support and autocomplete
- Easier to understand and contribute to

## Module Details

### `useOnboardingState.ts`
- **Purpose**: Main React hook for onboarding state management
- **Dependencies**: All other modules
- **Exports**: `useOnboardingState` hook

### `onboarding-api.ts`
- **Purpose**: API request utilities and authentication
- **Dependencies**: Firebase auth, onboarding types
- **Exports**: `OnboardingAPI` object, `makeAuthenticatedRequest` function

### `onboarding-navigation.ts`
- **Purpose**: Step order, progress calculation, and navigation helpers
- **Dependencies**: Onboarding types only
- **Exports**: Various utility functions for step management

### `onboarding-hook-types.ts`
- **Purpose**: TypeScript interfaces for the main hook
- **Dependencies**: Onboarding types only
- **Exports**: Interface definitions

## Migration Guide

### Before (Single File)
```typescript
import { useOnboardingState } from "@/hooks/useOnboardingState";
```

### After (Modular)
```typescript
// Still works the same way!
import { useOnboardingState } from "@/hooks";

// Now you can also import utilities separately
import { calculateProgress, getNextStep } from "@/hooks";
```

## Best Practices

1. **Use the main hook** for component state management
2. **Import utilities separately** when you only need specific functions
3. **Avoid direct API calls** - use the hook actions instead
4. **Import from the index file** (`@/hooks`) for better organization

## Testing

Each module can be tested independently:

```typescript
// Test navigation utilities
import { calculateProgress } from "@/hooks/onboarding-navigation";

// Test API functions
import { OnboardingAPI } from "@/hooks/onboarding-api";

// Test the main hook
import { useOnboardingState } from "@/hooks/useOnboardingState";
```

This modular approach makes the codebase more maintainable, testable, and easier to understand while preserving the same API for existing components.