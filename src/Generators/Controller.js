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
const toInputAttributeString = require('../helpers/field-type-to-input-attribute-string');

class ControllerGenerator extends BaseGenerator {

  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    const resource = '{-r,--resource?:Create a resourceful Controller}';
    const api = '{-a,--api?:Create a resourceful API Controller}';
    const jsonapi = '{-j,--jsonapi?:Create a resourceful JSON API Controller}';

    return `g:controller {name} ${resource} ${api} ${jsonapi} {fields...}`;
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new controller for APIs';
  }

  /**
   * handle method will be executed by ace. Here we
   * create the controller to controller directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle(args, options) {
    if (options.api || options.jsonapi) {
      options.resource = true;
    }

    const name = args.name;
    const entity = this._makeEntityName(name, 'controller', true);
    const toPath = path.join(this.helpers.appPath(), 'Http/Controllers', `${entity.entityPath}.js`);

    const modelName = inflect.demodulize(inflect.classify(name));

    const templateOptions = {
      methods: ['index', 'store', 'show', 'update', 'destroy'],
      api: options.api || false,
      json: options.jsonapi || false,
      resource: options.resource || false,
      controllerName: entity.entityName,
      modelName,
      singularCamelCase: inflect.camelize(modelName, false),
      pluralCamelCase: inflect.pluralize(inflect.camelize(modelName, false)),
    };

    const fields = args['fields...'] || [];
    const fieldTypes = fields.map((field) => toFieldType(field, templateOptions.modelName));
    templateOptions.with = fieldTypes
      .filter((field) => field.type === 'relation')
      .map((x) => `'${x.name}'`)
      .join(', ');

    if (options.api) {
      templateOptions.inputOnly = fieldTypes.map(toInputAttributeString).join(', ');
    }

    if (options.jsonapi) {
      templateOptions.attributes = fieldTypes
        .filter(({ type }) => type !== 'relation')
        .map(({ name: attributeName }) => `'${inflect.dasherize(attributeName)}'`)
        .join(', ');

      templateOptions.relations = fieldTypes
        .filter(({ type }) => type === 'relation');
      templateOptions.belongsTos = templateOptions.relations
        .filter(({ relation: { type } }) => type === 'belongsTo');
      templateOptions.foreignKeys = templateOptions.belongsTos
        .map(({ name: rName, relation: { foreignKey } }) =>
          `${foreignKey}: request.jsonApi.getRelationId('${rName}')`
        );
    }

    yield this._wrapWrite('controller', toPath, templateOptions);
  }

}

module.exports = ControllerGenerator;
