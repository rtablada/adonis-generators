const changeCase = require('change-case');

const relationshipTypes = [
  'belongsTo',
  'hasMany',
  'hasOne',
];

module.exports = function strToFieldType(str) {
  const [name, typeName, modelName, foreignKeyGuess] = str.split(':');
  let relation;
  let type;

  if (relationshipTypes.includes(typeName)) {
    const foreignKey = foreignKeyGuess || changeCase.snake(`${modelName}_id`);
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
