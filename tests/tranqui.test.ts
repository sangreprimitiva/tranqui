import { describe, it, expect } from 'vitest';
import { tranqui, type TranquiResult } from '../src/index';

function double(n: number) {
	if (n < 0) throw new Error('Negative not allowed');
	return n * 2;
}

async function fetchUserName(id: number): Promise<string> {
	if (id === 0) throw new Error('User not found');
	return `User-${id}`;
}

describe('tranqui', () => {
	it('returns success for a sync function', async () => {
		const r = await tranqui(double, 5);
		expect(r.ok).toBe(true);
		expect(r.hasError()).toBe(false);
		expect(r.error()).toBeNull();
		expect(r.value()).toBe(10);
	});

	it('returns an error result when a sync function throws', async () => {
		const r = await tranqui(double, -5);
		expect(r.ok).toBe(false);
		expect(r.hasError()).toBe(true);
		expect(r.value()).toBeNull();
		expect(r.error()).toBeInstanceOf(Error);
		expect(r.error()!.message).toBe('Negative not allowed');
		expect(r.errorValue).toBeInstanceOf(Error);
	});

	it('returns success for an async function that resolves', async () => {
		const r = await tranqui(fetchUserName, 7);
		expect(r.ok).toBe(true);
		expect(r.hasError()).toBe(false);
		expect(r.value()).toBe('User-7');
		expect(r.error()).toBeNull();
	});

	it('returns an error result for an async function that rejects', async () => {
		const r = await tranqui(fetchUserName, 0);
		expect(r.ok).toBe(false);
		expect(r.hasError()).toBe(true);
		expect(r.value()).toBeNull();
		expect(r.error()).toBeInstanceOf(Error);
		expect(r.error()!.message).toBe('User not found');
	});

	it('normalizes non-Error throws/rejections into Error', async () => {
		const r = await tranqui(() => {
			throw 'boom';
		});
		expect(r.ok).toBe(false);
		expect(r.hasError()).toBe(true);
		expect(r.error()).toBeInstanceOf(Error);
		expect(r.error()!.message).toBe('boom');
	});

	it('executes the function immediately (no microtask deferral)', async () => {
		const steps: string[] = [];
		const p = tranqui(() => {
			steps.push('fn');
			return 42;
		});
		steps.push('after call');
		// Because fn runs immediately, we should see "fn" before "after call".
		expect(steps).toEqual(['fn', 'after call']);
		const r = await p;
		expect(r.ok).toBe(true);
		expect(r.value()).toBe(42);
	});

	it('supports explicit typing via TranquiResult', async () => {
		const r: TranquiResult<number> = await tranqui((n: number) => n * 3, 3);
		expect(r.ok).toBe(true);
		expect(r.hasError()).toBe(false);
		expect(r.value()).toBe(9);
	});

	it('returns an error result when fn is not a function', async () => {
		// force a non-function value to cover the guard's true branch
		// @ts-expect-error intentional non-function
		const r = await tranqui(undefined);
		expect(r.ok).toBe(false);
		expect(r.hasError()).toBe(true);
		expect(r.value()).toBeNull();
		expect(r.error()).toBeInstanceOf(Error);
		expect(r.error()!.message).toBe('Invalid function');
	});
});
