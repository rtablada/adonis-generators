const inflect = require('i')();

const relationshipTypes = [
  'belongsTo',
  'hasMany',
  'hasOne',
];

module.exports = function strToFieldType(str) {
  const [name, typeName, modelNameGuess, foreignKeyGuess] = str.split(':');
  let relation;
  let type;

  if (relationshipTypes.includes(typeName)) {
    const modelName = modelNameGuess || inflect.singularize(inflect.classify(name));
    const foreignKey = foreignKeyGuess || inflect.underscore(`${modelName}_id`);
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
