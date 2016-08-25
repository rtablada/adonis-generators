'use strict';

/**
 * adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseGenerator = require('./Base');
const path = require('path');
const inflect = require('i')();
const toFieldType = require('../helpers/str-to-field-type');

const belongsToTypes = [
  'hasOne',
  'belongsTo',
];

function toJsonApiRelation(field, model) {
  const isBelongsTo = belongsToTypes.indexOf(field.relation.type) !== -1;
  const fromRelation = isBelongsTo
    ? inflect.camelize(inflect.tableize(model), false)
    : inflect.camelize(model, false);

  return {
    name: field.name,
    type: isBelongsTo ? 'belongsTo' : 'hasMany',
    viewName: field.relation.modelName,
    fromRelation,
  };
}

class JsonApiViewGenerator extends BaseGenerator {

  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    return 'g:jsonapiview {name} {fields...}';
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new JsonApiView';
  }

  /**
   * handle method will be executed by ace. Here we
   * create the controller to controller directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle(args) {
    const name = inflect.classify(args.name);
    const toPath = path.join(this.helpers.appPath(), 'Http/JsonApiViews', `${name}.js`);

    const fields = args['fields...'] || [];
    const fieldTypes = fields.map((field) => toFieldType(field, name));
    const relations = fieldTypes
      .filter((field) => field.type === 'relation')
      .map((relation) => toJsonApiRelation(relation, name));
    const attributes = fieldTypes
      .filter((field) => field.type !== 'relation')
      .map((x) => `'${x.name}'`)
      .join(', ');

    const templateOptions = {
      name,
      attributes,
      relations,
    };

    yield this._wrapWrite('json-api-view', toPath, templateOptions);
  }

}

module.exports = JsonApiViewGenerator;
