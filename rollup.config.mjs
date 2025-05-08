import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
	// input: 'src/index.ts',
	// output: [
  //   {
  //     file: 'dist/index.js',
  //     format: 'cjs',
  //   },
  //   {
  //     file: 'dist/index.min.js',
  //     format: 'cjs',
  //     plugins: [terser()],
  //   },
  //   {
  //     file: 'dist/yformula.js',
  //     format: 'umd',
  //     name: 'yformula',
  //   },
  //   {
  //     file: 'dist/yformula.min.js',
  //     format: 'umd',
  //     name: 'yformula',
  //     plugins: [terser()],
  //   },
  // ],
  plugins: [
    commonjs(),
    typescript({
      compilerOptions: {
        lib: ['es5', 'es6', 'es2017', 'es2019', 'dom'],
        target: 'es6',
        resolveJsonModule: true,
      }
    }),
    json(),
  ]
}