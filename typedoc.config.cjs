/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    "./src/renderer/src/lib/calc/index.ts",
    "./src/renderer/src/utils/index.ts",
    "./src/renderer/src/components/index.ts",

  ],
  out: "library_docs",
  categorizeByGroup: true,
  name: "Calculator",
  navigation: {
    includeGroups: true,
    includeCategories: true,
  },
};
