'use strict';

/**
 * Adapted from
 * adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const ServiceProvider = require('adonis-fold').ServiceProvider;

class GeneratorsProvider extends ServiceProvider {

  constructor() {
    super();
    this.generators = ['Migration', 'Model', 'Controller', 'JsonApiView', 'JsonApiResource'];
  }

  * register() {
    this.generators.forEach((generator) => {
      this.app.bind(`AdonisGenerators/Generate:${generator}`, (app) => {
        const Helpers = app.use('Adonis/Src/Helpers');
        const Generator = require(`../src/Generators/${generator}`);

        return new Generator(Helpers);
      });
    });
  }

}

module.exports = GeneratorsProvider;
