/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/naming-convention */

const DISABLE = 0;
const ERROR = 2;

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:jsx-a11y/strict',
		'plugin:react/jsx-runtime',
		'plugin:react/recommended',
		'plugin:unicorn/recommended',
		'plugin:@next/next/recommended',
		'next/core-web-vitals',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
		project: ['./tsconfig.json'],
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: '<root>/tsconfig.json',
			},
		},
	},
	ignorePatterns: [
		'/coverage',
		'/node_modules',
		'/.next',
		'/.vercel',
		'next-env.d.ts',
	],
	plugins: [
		'@typescript-eslint',
		'import',
		'jsx-a11y',
		'react',
		'unicorn',
	],
	rules: {
		// --------------------------------------------------------
		// Vanilla ESLint Rules
		// --------------------------------------------------------
		indent: [ERROR, 'tab', {SwitchCase: 1}],
		quotes: [ERROR, 'single'],
		semi: [ERROR, 'always'],
		'newline-before-return': [ERROR],
		'quote-props': [ERROR, 'as-needed'],
		'array-bracket-spacing': [ERROR, 'never'],
		'object-curly-spacing': [ERROR, 'never'],
		'computed-property-spacing': [ERROR, 'never'],
		'comma-dangle': [ERROR, 'always-multiline'],
		'padding-line-between-statements': ['error', {
			blankLine: 'always',
			prev: 'const',
			next: 'export',
		}, {
			blankLine: 'always',
			prev: '*',
			next: ['if', 'switch', 'for'],
		}],
		'comma-spacing': [ERROR, {
			before: false,
			after: true,
		}],
		'no-multi-spaces': [ERROR],
		'key-spacing': [ERROR, {
			beforeColon: false,
			afterColon: true,
			mode: 'strict',
		}],
		'space-infix-ops': [ERROR],
		'space-in-parens': [ERROR, 'never'],
		'keyword-spacing': [ERROR, {
			before: true,
			after: true,
		}],
		'space-unary-ops': [ERROR, {
			words: true,
			nonwords: false,
		}],
		'brace-style': [ERROR, '1tbs', {
			allowSingleLine: true,
		}],
		'default-param-last': [ERROR],
		'no-extra-parens': [ERROR, 'all', {
			ignoreJSX: 'all',
		}],
		'func-call-spacing': [ERROR, 'never'],
		'max-params': [ERROR, {
			max: 5,
		}],
		'max-depth': [ERROR, {
			max: 3,
		}],
		'max-lines': [ERROR, {
			max: 600,
		}],
		'arrow-spacing': [ERROR, {
			before: true,
			after: true,
		}],
		'no-multiple-empty-lines': [ERROR, {
			max: 1,
			maxEOF: 1,
		}],
		'padded-blocks': [ERROR, 'never'],
		'jsx-quotes': [ERROR, 'prefer-double'],
		// --------------------------------------------------------
		// Import Rules
		// --------------------------------------------------------
		'import/group-exports': [ERROR],
		'import/no-duplicates': [ERROR],
		'import/newline-after-import': [ERROR, {
			count: 1,
		}],
		// --------------------------------------------------------
		// React Rules
		// --------------------------------------------------------
		'react/jsx-curly-spacing': [ERROR, {
			when: 'never',
			allowMultiline: true,
			children: {
				when: 'never',
			},
		}],
		'react/boolean-prop-naming': [ERROR, {
			rule: '^(can|has|is|never|not|show|use|was|will)|.*?ed$',
			validateNested: true,
		}],
		'react/button-has-type': [ERROR],
		'react/function-component-definition': [ERROR, {
			namedComponents: 'arrow-function',
			unnamedComponents: 'arrow-function',
		}],
		'react/prop-types': [DISABLE],
		'react/jsx-boolean-value': [ERROR, 'never'],
		'react/jsx-child-element-spacing': [ERROR],
		'react/jsx-closing-bracket-location': [ERROR, 'tag-aligned'],
		'react/jsx-curly-brace-presence': [ERROR, 'never'],
		'react/jsx-curly-newline': [ERROR, 'consistent'],
		'react/jsx-equals-spacing': [ERROR, 'never'],
		'react/jsx-filename-extension': [ERROR, {
			allow: 'as-needed',
			extensions: ['.jsx', '.tsx'],
		}],
		'react/jsx-fragments': [ERROR, 'element'],
		'react/jsx-handler-names': [ERROR, {
			eventHandlerPrefix: 'handle',
			eventHandlerPropPrefix: 'on',
			checkLocalVariables: true,
			checkInlineFunction: true,
		}],
		'react/jsx-indent-props': [ERROR, 'tab'],
		'react/jsx-key': [ERROR, {
			checkFragmentShorthand: true,
			checkKeyMustBeforeSpread: true,
		}],
		'react/jsx-max-depth': [ERROR, {max: 10}],
		'react/jsx-uses-react': [DISABLE],
		'react/react-in-jsx-scope': [DISABLE],
		'react/jsx-first-prop-new-line': [ERROR, 'multiline-multiprop'],
		'react/jsx-newline': [ERROR, {
			prevent: true,
		}],
		'react/jsx-no-constructed-context-values': [ERROR],
		'react/jsx-no-duplicate-props': [ERROR, {
			ignoreCase: true,
		}],
		'react/jsx-no-target-blank': [ERROR, {
			enforceDynamicLinks: 'always',
			warnOnSpreadAttributes: true,
		}],
		'react/jsx-no-useless-fragment': [ERROR, {
			allowExpressions: true,
		}],
		'react/jsx-one-expression-per-line': [ERROR, {
			allow: 'single-child',
		}],
		'react/jsx-props-no-multi-spaces': [ERROR],
		'react/jsx-sort-props': [ERROR, {
			callbacksLast: true,
			shorthandFirst: true,
			reservedFirst: true,
			noSortAlphabetically: true,
		}],
		'react/jsx-pascal-case': [ERROR, {
			allowAllCaps: false,
			allowNamespace: true,
			allowLeadingUnderscore: false,
		}],
		'react/jsx-tag-spacing': [ERROR, {
			closingSlash: 'never',
			beforeSelfClosing: 'never',
			afterOpening: 'never',
			beforeClosing: 'never',
		}],
		'react/jsx-wrap-multilines': [ERROR, {
			declaration: 'parens-new-line',
			assignment: 'parens-new-line',
			return: 'parens-new-line',
			arrow: 'parens-new-line',
			condition: 'parens-new-line',
			logical: 'parens-new-line',
			prop: 'ignore',
		}],
		'react/no-access-state-in-setstate': [ERROR],
		'react/no-array-index-key': [ERROR],
		'react/no-children-prop': [ERROR],
		'react/no-danger-with-children': [ERROR],
		'react/no-deprecated': [ERROR],
		'react/no-unescaped-entities': [ERROR],
		'react/no-unknown-property': [ERROR],
		'react/no-unstable-nested-components': [ERROR],
		'react/no-unused-prop-types': [ERROR],
		'react/self-closing-comp': [ERROR, {
			component: true,
			html: true,
		}],
		// --------------------------------------------------------
		// A11Y Rules
		// --------------------------------------------------------
		'jsx-a11y/anchor-is-valid': [DISABLE],
		// --------------------------------------------------------
		// TypeScript Rules
		// --------------------------------------------------------
		'@typescript-eslint/naming-convention': [ERROR, {
			selector: 'default',
			format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
			leadingUnderscore: 'allow',
			trailingUnderscore: 'forbid',
		}, {
			selector: 'typeLike',
			format: ['PascalCase'],
			leadingUnderscore: 'forbid',
		}],
		'@typescript-eslint/no-unused-vars': [ERROR, {
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_',
		}],
		'@typescript-eslint/semi': [ERROR],
		'@typescript-eslint/array-type': [ERROR, {
			default: 'array-simple',
		}],
		'@typescript-eslint/ban-types': [ERROR],
		'@typescript-eslint/brace-style': [ERROR, '1tbs', {
			allowSingleLine: true,
		}],
		'@typescript-eslint/consistent-type-definitions': [ERROR, 'type'],
		'@typescript-eslint/consistent-type-exports': [ERROR, {
			fixMixedExportsWithInlineTypeSpecifier: false,
		}],
		'@typescript-eslint/consistent-type-imports': [ERROR, {
			prefer: 'type-imports',
		}],
		'@typescript-eslint/default-param-last': [ERROR],
		'@typescript-eslint/explicit-function-return-type': [ERROR, {
			allowExpressions: true,
			allowTypedFunctionExpressions: true,
			allowHigherOrderFunctions: true,
			allowDirectConstAssertionInArrowFunctions: true,
			allowConciseArrowFunctionExpressionsStartingWithVoid: false,
		}],
		'@typescript-eslint/type-annotation-spacing': [ERROR],
		'@typescript-eslint/func-call-spacing': [ERROR, 'never'],
		'@typescript-eslint/member-delimiter-style': [ERROR],
		'@typescript-eslint/method-signature-style': [ERROR, 'property'],
		'@typescript-eslint/no-base-to-string': [ERROR],
		'@typescript-eslint/no-confusing-non-null-assertion': [ERROR],
		'@typescript-eslint/no-confusing-void-expression': [ERROR],
		'@typescript-eslint/no-explicit-any': [ERROR],
		'@typescript-eslint/no-extra-non-null-assertion': [ERROR],
		'@typescript-eslint/no-extra-parens': [ERROR, 'all', {
			ignoreJSX: 'all',
		}],
		'@typescript-eslint/no-inferrable-types': [ERROR],
		'@typescript-eslint/no-non-null-asserted-nullish-coalescing': [ERROR],
		'@typescript-eslint/no-non-null-asserted-optional-chain': [ERROR],
		'@typescript-eslint/no-non-null-assertion': [ERROR],
		'@typescript-eslint/no-unnecessary-boolean-literal-compare': [ERROR],
		'@typescript-eslint/no-unnecessary-condition': [ERROR],
		'@typescript-eslint/no-unnecessary-type-assertion': [ERROR],
		'@typescript-eslint/no-unnecessary-type-constraint': [ERROR],
		'@typescript-eslint/no-unsafe-argument': [ERROR],
		'@typescript-eslint/no-unsafe-assignment': [ERROR],
		'@typescript-eslint/no-unsafe-call': [ERROR],
		'@typescript-eslint/no-unsafe-member-access': [ERROR],
		'@typescript-eslint/no-unsafe-return': [ERROR],
		'@typescript-eslint/no-unused-expressions': [ERROR],
		'@typescript-eslint/no-use-before-define': [ERROR],
		'@typescript-eslint/non-nullable-type-assertion-style': [ERROR],
		'@typescript-eslint/prefer-nullish-coalescing': [ERROR],
		'@typescript-eslint/prefer-optional-chain': [ERROR],
		'@typescript-eslint/prefer-reduce-type-parameter': [ERROR],
		'@typescript-eslint/prefer-string-starts-ends-with': [ERROR],
		'@typescript-eslint/promise-function-async': [ERROR],
		'@typescript-eslint/require-array-sort-compare': [ERROR],
		'@typescript-eslint/require-await': [ERROR],
		'@typescript-eslint/sort-type-constituents': [ERROR],
		'@typescript-eslint/strict-boolean-expressions': [ERROR],
		'@typescript-eslint/switch-exhaustiveness-check': [ERROR],
		'@typescript-eslint/restrict-template-expressions': [ERROR, {
			allowNumber: true,
			allowBoolean: false,
			allowAny: false,
			allowNullish: false,
			allowRegExp: false,
		}],
		'@typescript-eslint/restrict-plus-operands': [ERROR],
	},
};
