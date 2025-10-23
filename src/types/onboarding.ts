/**
 * @deprecated This file is deprecated. Import from @/types instead.
 *
 * This file now re-exports types from the new modular structure for backward compatibility.
 * All types have been split into focused files:
 * - @/types/base - Core enums and basic types
 * - @/types/user - User-related interfaces
 * - @/types/api - Request/response interfaces
 * - @/types/config - Configuration and constants
 * - @/types/index - Centralized exports (recommended)
 *
 * Please update your imports to use @/types instead of @/types/onboarding
 */

// Re-export all types from the new modular structure
export * from "./index";
