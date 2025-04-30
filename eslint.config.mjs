import globals from "globals";
import pluginJs from "@eslint/js";
import spellCheck from "eslint-plugin-spellcheck";

export default [
  {
    files: ["**/*.js"],
    rules: {
      "@spellCheck/spell-checker": [
        "error",
        {
          comments: false, // No validar comentarios
          strings: false, // No validar cadenas literales
          identifiers: true, // Validar identificadores
          templates: false, // No validar templates
          ignoreRequire: false,
          enableUpperCaseUnderscoreCheck: false,
          skipIfMatch: [],
          skipWordIfMatch: [],
          minLength: 1,
          skipWords: [
            "SNS",
            "SQS",
            "ARN",
            "MARSHALL",
            "UNMARSHALL",
            "BTW",
            "SMS",
            "WHATSAPP",
            "COGNITO",
            "UNPROCESSABLE",
            "SRV",
            "QS",
            "AUTHORIZER",
            "REQ",
            "CORS",
            "DEPENDENCIE",
            "USECASE",
            "USECASES",
            "NANOID",
          ], // Puedes mantener skipWords vacío o ajustarlo
        },
      ],
    },
    plugins: {
      "@spellCheck": spellCheck,
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
];
