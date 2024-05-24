const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
	{
		ignores: ["**/__test__", "**/*.json"],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				ecmaVersion: 2020,
			},
		},
	},
	{
		files: ["*.ts", "*.js"],
		...tseslint.configs.disableTypeChecked,
	},
	{
		files: ["*.test *.js"],
		rules: {
			"@typescript-eslint/no-unused-vars": 0,
			"@typescript-eslint/no-unsafe-call": 0,
			languageOptions: {
				globals: {
					it: "readonly",
					describe: "readonly",
				},
			},
		},
	},
	{
		rules: {
			semi: "error",
			"@typescript-eslint/no-unused-vars": 2,
			"@typescript-eslint/no-explicit-any": 0,
			"@typescript-eslint/no-var-requires": 0,
			"no-shadow": [2, { allow: ["req", "res", "err"] }],
			"new-cap": 0,
			"one-var-declaration-per-line": 0,
			"consistent-return": 0,
			"no-param-reassign": 0,
			"comma-dangle": 0,
			"no-undef": 0,
			curly: ["error", "multi-line"],
		},
	},
);