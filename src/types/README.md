# Types - Modular Architecture

This directory contains the refactored type definitions split into focused, maintainable modules.

## File Structure

### Core Files

- **`index.ts`** - Centralized export file for all types (recommended import source)
- **`onboarding.ts`** - Deprecated file that re-exports for backward compatibility

### Modular Type Files

- **`base.ts`** - Core enums and primitive types
- **`user.ts`** - User-related interfaces and data structures
- **`api.ts`** - API request/response interfaces
- **`config.ts`** - Configuration constants and utility types

## Usage

### Recommended Usage (New)

```typescript
// Import all types from the centralized index
import type { 
  User, 
  OnboardingStep, 
  UserProfile,
  ConsentResponse 
} from "@/types";

// Import configuration
import { ONBOARDING_CONFIG } from "@/types";
```

### Specific Module Imports

```typescript
// Import only base types
import type { OnboardingStep, Locale } from "@/types/base";

// Import only user types
import type { User, UserProfile } from "@/types/user";

// Import only API types
import type { ConsentRequest, ConsentResponse } from "@/types/api";

// Import configuration
import { ONBOARDING_CONFIG } from "@/types/config";
```

### Backward Compatibility (Deprecated)

```typescript
// Still works but deprecated
import type { User, OnboardingStep } from "@/types/onboarding";
```

## Module Details

### `base.ts`
**Purpose**: Core type definitions and enums
- Onboarding steps
- Status enums (KYC, Broker, etc.)
- Basic types (locales, themes, etc.)
- Provider types

### `user.ts`
**Purpose**: User data structures and related interfaces
- User profile information
- Consent data structures
- KYC document interfaces
- Wallet, broker, security data
- User preferences
- Main User interface

### `api.ts`
**Purpose**: API communication interfaces
- Request/response pairs for all endpoints
- Organized by feature (consents, profile, KYC, etc.)
- Type-safe API contracts

### `config.ts`
**Purpose**: Configuration and constants
- Application configuration
- Legal document versions
- Analytics event names
- Error classes

## Architecture Benefits

### 🏗️ **Modular Structure**
- Each file has a single responsibility
- Easy to find related types
- Better code organization

### 🔧 **Maintainability**
- Changes to user types only affect `user.ts`
- API changes are isolated in `api.ts`
- Configuration is centralized

### 📦 **Reusability**
- Import only what you need
- Avoid large bundle sizes
- Clear dependencies between modules

### 🎯 **Developer Experience**
- Better IDE autocomplete
- Clearer error messages
- Easier to understand relationships

## Migration Guide

### Before (Single File)
```typescript
import type { 
  User, 
  OnboardingStep, 
  ConsentResponse 
} from "@/types/onboarding";
```

### After (Recommended)
```typescript
import type { 
  User, 
  OnboardingStep, 
  ConsentResponse 
} from "@/types";
```

### For Specific Modules
```typescript
// If you only need base types
import type { OnboardingStep } from "@/types/base";

// If you only need user types
import type { User } from "@/types/user";

// If you only need API types
import type { ConsentResponse } from "@/types/api";
```

## Type Dependencies

```
base.ts (primitives)
    ↓
user.ts (depends on base)
    ↓
api.ts (depends on base + user)
    ↓
config.ts (depends on base)
    ↓
index.ts (exports all)
```

## Best Practices

1. **Use the index file** for most imports: `import type { ... } from "@/types"`
2. **Import specific modules** only when you need a subset of types
3. **Avoid the deprecated** `onboarding.ts` file in new code
4. **Keep related types together** when adding new interfaces

## Testing

Each module can be tested independently:

```typescript
// Test base types
import type { OnboardingStep } from "@/types/base";

// Test user types
import type { User } from "@/types/user";

// Test API types
import type { ConsentRequest } from "@/types/api";
```

## Future Additions

When adding new types:

1. **Determine the category**: Base, User, API, or Config
2. **Add to the appropriate file**: Follow existing patterns
3. **Export from index.ts**: Add to the centralized exports
4. **Update documentation**: Keep this README current

This modular approach makes the type system more maintainable, testable, and easier to understand while preserving backward compatibility for existing code.