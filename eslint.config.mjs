import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sis from "eslint-plugin-simple-import-sort";
import globals from "globals";
import YAML from "yaml";


const getRules = () => {
  const file = fs.readFileSync(path.join(__dirname, ".eslint-rules.yaml"), "utf8");
  const obj = YAML.parse(file);
  return obj;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,

  allConfig: js.configs.all
});


export default [
  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": sis,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: getRules(),
    settings: {
      settings: {
        "import/resolver": {
          typescript: {}
        }
      }
    }
  },
];
