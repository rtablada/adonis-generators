'use strict';

const BaseGenerator = require('./Base');

const inflect = require('i')();

class JsonApiResourceGenerator extends BaseGenerator {

  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    return 'g:jsonapiresource {name} {fields...} ';
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new model, migration, controller, and JsonApiView for a resource';
  }

  /**
   * handle method will be executed by ace.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle({ name, 'fields...': fields }) {
    this.run('g:jsonapiview', [name, ...fields]);
    this.run('g:migration', [name, ...fields]);
    this.run('g:model', [name, ...fields]);
    this.run('g:controller', [name, ...fields], { jsonapi: true });

    this.success('All done!');

    const entity = this._makeEntityName(name, 'controller', true);
    const controllerName = entity.entityName;
    const resourceName = inflect.dasherize(inflect.tableize(name));

    this.success('Add the following route for your new resource:');
    this.info(`Route.resource('/${resourceName}', ` +
      `'${controllerName}').except(['create', 'edit']);`);
  }

}

module.exports = JsonApiResourceGenerator;
