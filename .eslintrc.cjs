module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-var': 'error', // Require the use of 'let' or 'const' instead of 'var'.
    'no-multiple-empty-lines': ['warn', { max: 1 }], // Disallow multiple empty lines.
    'no-console': 'off', // Disallow the use of 'console' in production (enabled in development).
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // Disallow the use of 'debugger' in production (enabled in development).
    'no-unexpected-multiline': 'error', // Disallow unexpected multiline expressions.
    'no-useless-escape': 'off', // Allow the use of unnecessary escape characters.
    '@typescript-eslint/no-unused-vars': 'error', // Disallow the declaration of unused variables.
    '@typescript-eslint/prefer-ts-expect-error': 'error', // Disallow the use of @ts-ignore and encourage the use of @ts-expect-error.
    '@typescript-eslint/no-explicit-any': 'off', // Allow the use of the 'any' type.
    '@typescript-eslint/no-non-null-assertion': 'off', // Allow the use of non-null assertion operator.
    '@typescript-eslint/no-namespace': 'off', // Allow the use of custom TypeScript modules and namespaces.
    '@typescript-eslint/semi': 'off', // Allow or disallow semicolons instead of enforcing them.
    'vue/multi-word-component-names': 'off', // Allow multi-word component names.
    'vue/script-setup-uses-vars': 'error', // Ensure that variables used in <script setup> are marked as used in <template>.
    'vue/no-mutating-props': 'off', // Allow mutating props.
    'vue/attribute-hyphenation': 'off', // Allow or disallow hyphenated attributes in Vue templates.
    'vue/no-setup-props-destructure': 'off',
  },
}
