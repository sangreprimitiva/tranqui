export type TranquiResult<T> = {
	value(): T | null;
	error(): Error | null;
	hasError(): boolean;
	readonly ok: boolean;
	readonly errorValue?: Error;
};

const toError = (e: unknown) => (e instanceof Error ? e : new Error(String(e)));

const ok = <T>(v: T): TranquiResult<T> => ({
	ok: true,
	value: () => v,
	error: () => null,
	hasError: () => false
});

const fail = <T>(e: unknown): TranquiResult<T> => {
	const err = toError(e);
	return {
		ok: false,
		errorValue: err,
		value: () => null,
		error: () => err,
		hasError: () => true
	};
};

export function tranqui<TArgs extends any[], TReturn>(
	fn: (...args: TArgs) => TReturn,
	...args: TArgs
): Promise<TranquiResult<Awaited<TReturn>>> {
	if (typeof fn !== 'function') {
		return Promise.resolve(
			fail<Awaited<TReturn>>(new Error('Invalid function'))
		);
	}
	try {
		// Ejecuta fn inmediatamente; si devuelve promesa, la encadenamos.
		const out = fn(...args);
		return Promise.resolve(out).then(
			(v) => ok<Awaited<TReturn>>(v as Awaited<TReturn>),
			(e) => fail<Awaited<TReturn>>(e)
		);
	} catch (e) {
		// Captura throws síncronos
		return Promise.resolve(fail<Awaited<TReturn>>(e));
	}
}
