/**
 * Common utility types
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type ID = string | number;
