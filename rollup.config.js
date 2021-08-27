import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import svg from 'rollup-plugin-svelte-svg';

const createPreprocessors = require('./svelte.config').createPreprocessors;
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn(
				'npm',
				['run', 'electron'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				},
			);

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}

export default {
	input: 'src/index.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'Skizzle',
		file: 'public/build/bundle.js',
	},
	plugins: [
		svg(),
		nodePolyfills(),
		svelte({
			compilerOptions: {
				dev: !production,
			},
			preprocess: createPreprocessors(!production),
		}),
		css({
			output: 'bundle.css',
			sourceMap: !production,
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),
		!production && serve(),
		!production && livereload('public'),
		production && terser(),
		filesize(),
	],
	external: ['electron', 'child_process', 'fs', 'path', 'url', 'module', 'os'],
	watch: {
		clearScreen: false,
	},
};
