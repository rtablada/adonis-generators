'use strict';

const BaseGenerator = require('./Base');
const path = require('path');
const toFieldType = require('../helpers/str-to-field-type');
const toModelProperty = require('../helpers/field-type-to-model-property');

class ModelGenerator extends BaseGenerator {

  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    const migrationsFlag = '{-m,--migration?:Create migration for a given model}';

    return `g:model {name} {fields...} ${migrationsFlag}`;
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new model with optional migration';
  }

  /**
   * handle method will be executed by ace. Here we
   * create the model to models directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle(args, options) {
    const name = args.name;
    const entity = this._makeEntityName(name, 'model', false, 'singular');
    const toPath = path.join(this.helpers.appPath(), 'Model', `${entity.entityPath}.js`);
    const template = options.template || 'model';
    const fieldStrs = args['fields...'] || [];
    const fields = fieldStrs
      .map((field) => toFieldType(field, entity.entityPath))
      .map(toModelProperty)
      .filter((x) => x !== '');
    const templateOptions = {
      fields,
      name: entity.entityName,
      table: options.table,
      connection: options.connection,
    };

    try {
      yield this.write(template, toPath, templateOptions);
      this._success(toPath);
      this._createMigration(options, args);
    } catch (e) {
      this._error(e.message);
    }
  }

  /**
   * creates migration for corresponding model, if
   * options.migration is defined.
   *
   * @param  {Object} options
   * @param  {String} name
   *
   * @private
   */
  _createMigration(options, { name, 'fields...': fields }) {
    if (options.migration) {
      this.run('g:migration', [name, ...fields]);
    }
  }

}

module.exports = ModelGenerator;
