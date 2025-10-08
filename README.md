# tranqui

Unified wrapper (sync + async) that returns a typed **Result** with either the **value or the error** (no throws). Same API for both worlds.
`tranqui` executes the function immediately (no microtask deferral); if it returns a Promise, the Promise is awaited; if it throws synchronously, the error is captured.

## Installation

```sh
npm i @sangreprimitiva/tranqui
```

## Usage

```ts
import { tranqui } from '@sangreprimitiva/tranqui';

// Sync function
function double(n: number) {
	if (n < 0) throw new Error('Negative not allowed');
	return n * 2;
}

// Async function
async function fetchUserName(id: number): Promise<string> {
	if (id === 0) throw new Error('User not found');
	return `User-${id}`;
}

const r1 = await tranqui(double, 5);
if (r1.hasError()) {
	// Handle error
	console.error(r1.error());
}
// r1.value() has the successful result

const r2 = await tranqui(fetchUserName, 7);
if (r2.hasError()) {
	// Handle error
	console.error(r2.error());
}
// r2.value() has the successful result
```

## API

```ts
export type TranquiResult<T> = {
	value(): T | null; // returns the value when successful
	error(): Error | null; // returns the error when failed
	hasError(): boolean; // true if there was an error
	readonly ok: boolean; // same as !hasError(), convenient for logging
	readonly errorValue?: Error; // raw error for debugging/logging
};

export function tranqui<TArgs extends any[], TReturn>(
	fn: (...args: TArgs) => TReturn,
	...args: TArgs
): Promise<TranquiResult<Awaited<TReturn>>>;
```

### Behavior

-   **Immediate execution**: `fn` runs right away; if it returns a Promise, its resolution/rejection is handled.
-   **No throws to the caller**: inspect `.hasError()` (or `.ok`) and then read `.value()` or `.error()`.
-   **Error normalization**: non-`Error` rejections are converted to `Error` via `new Error(String(e))`.

## Why

-   One unified pattern for error handling across sync and async code.
-   Eliminates try/catch at call sites; makes error paths explicit and testable.
-   Ergonomic methods: `value()`, `error()`, `hasError()`, plus `ok` and `errorValue` for logging.

## Requirements

-   TypeScript 5.0+ (recommended). Node 18+ if targeting Node runtimes.

## License

MIT
