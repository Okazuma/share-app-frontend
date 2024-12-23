module.exports = {
    extends: [
        'eslint:recommended',               // 基本的なJavaScriptのルール ESLintの推奨ルールを適用
        'plugin:vue/vue3-essential',        // Vue 3用の基本ルール Vue 3の基本的なルールを適用
        'plugin:prettier/recommended',      // Prettierとの統合ルール Prettierの推奨設定を適用
    ],
    plugins: ['vue', 'prettier'],
    rules: {
        'prettier/prettier': 'error',       // Prettierのエラールールを強制
        'vue/max-attributes-per-line': 'off', // 必要に応じてカスタマイズ
    },
};
