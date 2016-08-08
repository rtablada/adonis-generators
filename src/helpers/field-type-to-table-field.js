module.exports = function fieldTypeToTableField(fieldType) {
  return `table.${fieldType.type}('${fieldType.name}');`;
};
