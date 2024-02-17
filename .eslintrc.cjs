/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	env: {
		"browser": true,
		"es2021": true,
		"node": true
	},
	reportUnusedDisableDirectives: true,
	parserOptions: {
		ecmaVersion: 6,
		ecmaFeatures: {
			jsx: true,
		},
		project: './tsconfig.json',
		tsconfigRootDir: './',
	},
	settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
        linkComponents: [
            { name: 'Link', linkAttribute: 'to' },
            { name: 'NavLink', linkAttribute: 'to' },
        ],
    },
    env: {
        browser: true,
        es6: true,
    },
    plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
	extends: [
		"eslint-config-prettier",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'app/http/public', "tools", "resources-old"],
	overrides: [
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{ts,mjs,js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	parserOptions: {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	parser: "@typescript-eslint/parser",
	plugins: [
		"react-refresh",
		"@typescript-eslint"
	],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		indent: [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		quotes: [
			"error",
			"double"
		],
		'react/react-in-jsx-scope': 'off', // Configuração da regra
		semi: [
			"error",
			"always"
		]
	},
};
