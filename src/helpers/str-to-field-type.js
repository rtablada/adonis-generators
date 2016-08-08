module.exports = function strToFieldType(str) {
  const [name, typeName, modelName, foreignKey] = str.split(':');
  let relation;
  let type;

  if (typeName === 'belongsTo') {
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
