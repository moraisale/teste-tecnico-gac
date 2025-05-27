import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",   // permite uso de 'any'
      "@typescript-eslint/no-unsafe-assignment": "off", // permite atribuições de 'unknown'
      "@typescript-eslint/no-unsafe-member-access": "off", // permite acessar propriedades de 'unknown'
      "@typescript-eslint/no-unsafe-call": "off", // permite chamar funções 'unknown'
      "@typescript-eslint/no-unsafe-return": "off", // permite retornar 'unknown'
      "@typescript-eslint/no-unsafe-argument": "off", // permite passar 'unknown' como argumento
    },
  },
];

export default eslintConfig;
