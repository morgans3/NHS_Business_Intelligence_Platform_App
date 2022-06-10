/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jasmine: true,
    },
    globals: {
        cy: true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:cypress/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
        extraFileExtensions: [".", ".json", ".md"],
        projectFolderIgnoreList: ["**/node_modules", "**/dist", "**/coverage", "**/documentation"],
    },
    plugins: [
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "@angular-eslint/eslint-plugin",
        "@angular-eslint/eslint-plugin-template",
        "eslint-plugin-prefer-arrow",
        "@typescript-eslint",
    ],
    rules: {
        "@angular-eslint/component-class-suffix": "error",
        "@angular-eslint/contextual-lifecycle": "error",
        "@angular-eslint/directive-class-suffix": "error",
        "@angular-eslint/no-conflicting-lifecycle": "error",
        "@angular-eslint/no-host-metadata-property": "off",
        "@angular-eslint/no-input-rename": "error",
        "@angular-eslint/no-inputs-metadata-property": "error",
        "@angular-eslint/no-output-native": "error",
        "@angular-eslint/no-output-on-prefix": "error",
        "@angular-eslint/no-output-rename": "error",
        "@angular-eslint/no-outputs-metadata-property": "error",
        "@angular-eslint/use-lifecycle-interface": "error",
        "@angular-eslint/use-pipe-transform-interface": "error",
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    Object: {
                        message: "Avoid using the `Object` type. Did you mean `object`?",
                    },
                    Function: {
                        message: "Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
                    },
                    Boolean: {
                        message: "Avoid using the `Boolean` type. Did you mean `boolean`?",
                    },
                    Number: {
                        message: "Avoid using the `Number` type. Did you mean `number`?",
                    },
                    String: {
                        message: "Avoid using the `String` type. Did you mean `string`?",
                    },
                    Symbol: {
                        message: "Avoid using the `Symbol` type. Did you mean `symbol`?",
                    },
                },
            },
        ],
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
                accessibility: "explicit",
            },
        ],
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": [
            "error",
            {
                ignoreParameters: true,
            },
        ],
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-shadow": [
            "off",
            {
                hoist: "all",
            },
        ],
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/quotes": ["error", "double", { allowTemplateLiterals: true }],
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                path: "always",
                types: "prefer-import",
                lib: "always",
            },
        ],
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-parens": ["off", "always"],
        "comma-dangle": "off",
        complexity: "off",
        "constructor-super": "error",
        "cypress/no-unnecessary-waiting": "off",
        "dot-notation": "off",
        eqeqeq: ["error", "smart"],
        "guard-for-in": "error",
        "id-denylist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"],
        "id-match": "error",
        "import/no-deprecated": "warn",
        "import/order": "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/newline-after-description": "error",
        "jsdoc/no-types": "error",
        "max-classes-per-file": "off",
        "max-len": [
            "error",
            {
                code: 140,
            },
        ],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": [
            "error",
            {
                allow: [
                    "log",
                    "warn",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context",
                ],
            },
        ],
        "no-debugger": "error",
        "no-empty": "off",
        "no-empty-function": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "off",
        "no-new-wrappers": "error",
        "no-prototype-builtins": "off",
        "no-restricted-imports": ["error", "rxjs/Rx"],
        "no-shadow": "off",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "no-unused-expressions": "off",
        "no-unused-labels": "error",
        "no-use-before-define": "off",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "prefer-arrow/prefer-arrow-functions": "error",
        "prefer-const": "error",
        "quote-props": ["error", "as-needed"],
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "@typescript-eslint/quotes": ["error", "double", { allowTemplateLiterals: true }],
        radix: "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "spaced-comment": [
            "error",
            "always",
            {
                markers: ["/"],
            },
        ],
        "use-isnan": "error",
        "valid-typeof": "off",
    },
};
