import { tanstackConfig } from "@tanstack/eslint-config";
import reactPlugin from "eslint-plugin-react";

export default [
  ...tanstackConfig,
  {
    // 빌드 출력 및 자동 생성 파일 제외
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
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "sort-imports": "off",
      "import/order": "off",
      // pnpm workspace 규칙 비활성화 (workspace 설정이 없는 프로젝트용)
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // shadcn/ui 컴포넌트에 대한 ESLint 규칙 완화
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "no-shadow": "off",
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
          selector: "ClassDeclaration[superClass.name='Component']",
          message: "React 클래스 컴포넌트 금지. 함수 컴포넌트 사용",
        },
        {
          selector: "ClassDeclaration[superClass.name='PureComponent']",
          message: "React 클래스 컴포넌트 금지. 함수 컴포넌트 사용",
        },
        {
          selector: "ClassDeclaration[superClass.property.name='Component']",
          message: "React 클래스 컴포넌트 금지. 함수 컴포넌트 사용",
        },
        {
          selector:
            "ClassDeclaration[superClass.property.name='PureComponent']",
          message: "React 클래스 컴포넌트 금지. 함수 컴포넌트 사용",
        },
      ],
    },
  },
];
