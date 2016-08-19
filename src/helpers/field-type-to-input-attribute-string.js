module.exports = function fieldTypeToInputAttributeString(fieldType) {
  if (fieldType.type === 'relation') {
    return `'${fieldType.relation.foreignKey}'`;
  }

  return `'${fieldType.name}'`;
};
