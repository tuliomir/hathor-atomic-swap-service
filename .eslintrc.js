module.exports = {
    env: {
        browser: false,
        node: true,
        es2022: true,
    },
    extends: [
        'eslint-config-airbnb-base'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint'
    ]
}
