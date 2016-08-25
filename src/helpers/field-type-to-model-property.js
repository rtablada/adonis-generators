function relationToModelProperty(fieldType) {
  const args = `'App/Model/${fieldType.relation.modelName}',`
    + ` 'id', '${fieldType.relation.foreignKey}'`;

  return `${fieldType.name}() {
    return this.${fieldType.relation.type}(${args});
  }`;
}


module.exports = function fieldTypeToModelProperty(fieldType) {
  if (fieldType.type === 'relation') {
    return relationToModelProperty(fieldType);
  }

  return '';
};
