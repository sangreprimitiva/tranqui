import { tranqui, type TranquiResult } from '../src/index';

function double(n: number) {
	if (n < 0) throw new Error('Negative not allowed');
	return n * 2;
}

async function fetchUserName(id: number): Promise<string> {
	if (id === 0) throw new Error('User not found');
	return `User-${id}`;
}

const run = async () => {
	const ok1: TranquiResult<number> = await tranqui(double, 5);
	console.log('double 5 ->', {
		ok: ok1.ok,
		value: ok1.value(),
		error: ok1.error()
	});

	const bad1 = await tranqui(double, -5);
	console.log('double -5 ->', {
		ok: bad1.ok,
		value: bad1.value(),
		error: bad1.error()?.message
	});

	const ok2 = await tranqui(fetchUserName, 7);
	console.log('user 7 ->', {
		ok: ok2.ok,
		value: ok2.value(),
		error: ok2.error()
	});

	const bad2 = await tranqui(fetchUserName, 0);
	console.log('user 0 ->', {
		ok: bad2.ok,
		value: bad2.value(),
		error: bad2.error()?.message
	});
};

run().catch((e) => {
	console.error('Unexpected:', e);
	process.exit(1);
});
