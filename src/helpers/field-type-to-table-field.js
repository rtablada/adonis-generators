const inflect = require('i')();

function relationToTableField(fieldType) {
  if (fieldType.relation.type === 'belongsTo') {
    const reference = inflect.tableize(`${fieldType.relation.modelName}`);

    return `table.integer('${fieldType.relation.foreignKey}').references('${reference}.id');`;
  }

  return '';
}

module.exports = function fieldTypeToTableField(fieldType) {
  if (fieldType.type === 'relation') {
    return relationToTableField(fieldType);
  }

  return `table.${fieldType.type}('${fieldType.name}');`;
};
