/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ["./src/renderer/src/lib/calc/index.ts"],
  out: "library_docs",
  categorizeByGroup: true,
  name: "Calculator Library",
  navigation: {
    includeGroups: true,
    includeCategories: true,
  },
};
