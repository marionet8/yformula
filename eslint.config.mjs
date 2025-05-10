import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
	{
		// languageOptions: {
		// 	globals: {
		// 		...globals.browser,
		// 		...globals.node
		// 	},
		// 	parserOptions: {
		// 		ecmaVersion: "latest"
		// 	},
		// },
		plugins: {
		},
		rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
		}
	},
]