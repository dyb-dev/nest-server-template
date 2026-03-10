/*
 * @FileDesc: eslint 配置 注意：每次配置的更改，建议重启一下编辑器，否则可能不会生效
 */

module.exports = {
    extends: ["@dyb-dev/eslint-config"],
    overrides: [
        // #region CODE: eslint 基础配置
        {
            files: ["**/*.*js", "**/*.ts", "**/*.vue", "**/*.jsx", "**/*.tsx", "**/*.json", "**/*.jsonc"],
            rules: {
                // 要求缩进为4个空格，并忽略类属性的缩进检查，避免 TS 装饰器和类属性缩进不一致
                indent: ["error", 4, { ignoredNodes: ["PropertyDefinition"] }]
            }
        },
        // #endregion

        // #region CODE: ts 配置
        {
            files: ["**/*.ts", "**/*.d.ts", "**/*.vue", "**/*.tsx"],
            rules: {
                // 禁用强制使用 type import，避免导入 DTO 时使用 type 关键字进行导入，导致 Pipe 校验失效
                "@typescript-eslint/consistent-type-imports": "off"
            }
        }
        // #endregion
    ]
}
