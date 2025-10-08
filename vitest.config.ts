import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			all: true, // calcula cobertura sobre el set incluido
			include: ['src/**/*.{ts,tsx,js}'], // solo código fuente
			exclude: [
				'node_modules/**',
				'dist/**',
				'examples/**',
				'tests/**',
				'**/*.d.ts'
			],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100
			},
			reportOnFailure: true
		}
	}
});
