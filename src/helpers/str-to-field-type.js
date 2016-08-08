const relationshipTypes = [
  'belongsTo',
  'hasMany',
  'hasOne',
];

module.exports = function strToFieldType(str) {
  const [name, typeName, modelName, foreignKey] = str.split(':');
  let relation;
  let type;

  if (relationshipTypes.includes(typeName)) {
    relation = {
      type: typeName,
      modelName,
      foreignKey,
    };

    type = 'relation';
  } else {
    type = typeName;
  }

  return {
    name,
    type,
    relation,
    raw: str,
  };
};
