'use strict';

const BaseGenerator = require('./Base');
const i = require('i')();
const toFieldType = require('../helpers/str-to-field-type');
const toTableField = require('../helpers/field-type-to-table-field');

class MigrationGenerator extends BaseGenerator {
  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    return 'g:migration {name} {fields...}';
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new migration file for a resource';
  }

  /**
   * called by ace automatically. It will create a new
   * migrations file inside the migrations directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle(args, options = {}) {
    const name = args.name;
    const fieldStrs = args['fields...'] || [];
    const entity = this._makeEntityName(name, 'migration', false);
    const toPath = this.helpers.migrationsPath(`${new Date().getTime()}_${name}.js`);
    const template = 'migration';

    const fields = fieldStrs.map(toFieldType).map(toTableField);

    const templateOptions = {
      table: i.tableize(entity.entityName),
      create: !!options.create,
      name: entity.entityName,
      connection: options.connection,
      fields,
    };
    yield this._wrapWrite(template, toPath, templateOptions);
  }
}

module.exports = MigrationGenerator;
