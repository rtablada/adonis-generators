const inflect = require('i')();

const relationshipTypes = [
  'belongsTo',
  'hasMany',
  'hasOne',
];

module.exports = function strToFieldType(str, currentModelName) {
  const [name, typeName, modelNameGuess, foreignKeyGuess] = str.split(':');
  let relation;
  let type;

  if (relationshipTypes.includes(typeName)) {
    let foreignKeyModel = currentModelName;

    const modelName = modelNameGuess || inflect.singularize(inflect.classify(name));

    if (typeName === 'belongsTo') {
      foreignKeyModel = modelName;
    }

    const foreignKey = foreignKeyGuess || inflect.underscore(`${foreignKeyModel}_id`);
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
