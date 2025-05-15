import {defineConfig} from 'tsup';
import {peerDependencies} from './package.json';

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ['src/**/*.(ts|js)'],
		format: ['esm'],
		target: 'esnext',
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(peerDependencies), 'astro:env'],
		tsconfig: 'tsconfig.json',
	};
});
