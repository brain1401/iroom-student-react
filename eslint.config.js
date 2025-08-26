import { tanstackConfig } from "@tanstack/eslint-config";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    ignores: [
      ".output/**",
      ".nitro/**",
      "dist/**",
      "build/**",
      "*.gen.ts",
      "*.gen.js",
      "node_modules/**",
      "public/sw.js",
    ],
  },
  ...tanstackConfig,
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "sort-imports": "off",
      "import/order": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prefer-stateless-function": [
        "error",
        { ignorePureComponents: false },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "React 컴포넌트에서 default export 금지. named export 사용하세요.",
        },
      ],
    },
  },
];
