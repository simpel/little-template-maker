module.exports = {
  prettier: true,
  plugins: [
    "unused-imports",
  ],
  include: [
      "src/**/*.ts",
      "src/**/*.tsx"
	],
		ignorePatterns: [
		'**/*.js',
		'**/*.d.ts',
		'node_modules',
		'dist',
		'template/**',
	],
    ignores: [
      "**/*.js",
      "**/*.d.ts",
      "node_modules",
      "dist",
      "template/**"
    ],
  rules: {
    'import/extensions': ['off'],
    "no-unused-vars": "off",
    "no-console": "warn",
    'n/file-extension-in-import': 'off',
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{ "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
		],
    '@typescript-eslint/naming-convention': ['warn', {
      format: ['camelCase', 'PascalCase'],
      selector: 'variableLike'
    }, {
      format: ['PascalCase', 'camelCase'],
      modifiers: ['exported'],
      selector: 'variable'
    }, {
      filter: {
        match: true,
        regex: '^create|^use|^get|^set|^post'
      },
      format: ['camelCase', 'snake_case'],
      selector: 'variable'
    }, {
      format: ['PascalCase'],
      selector: 'function'
    }, {
      format: ['PascalCase'],
      prefix: ['I'],
      selector: 'interface'
    }, {
      format: ['PascalCase'],
      prefix: ['T'],
      selector: 'typeAlias'
    }, {
      format: ['PascalCase'],
      prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      selector: 'variable',
      types: ['boolean']
    }],
    'max-params': ['warn', 6],
    'unicorn/filename-case': ['warn', {
      case: 'pascalCase',
      ignore: ['^use.*.ts$', '^runtime.*.ts$', '^.*.config.ts$', '^.*.styles.ts$', 'index.*.ts$']
    }]
  }
};