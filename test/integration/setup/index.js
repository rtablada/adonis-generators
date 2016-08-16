'use strict';

/**
 * adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const fold = require('adonis-fold');
const Ace = require('adonis-ace');
const path = require('path');
const fs = require('co-fs-extra');
const Helpers = {
  migrationsPath(fileName) {
    const file = fileName.replace(/\d+_/g, '');

    return path.join(__dirname, '../app/migrations/', file);
  },
  appPath() {
    return path.join(__dirname, '../app');
  },
  viewsPath() {
    return path.join(__dirname, '../app/views');
  },
  basePath() {
    return this.appPath();
  },
  seedsPath(file) {
    return path.join(__dirname, '../app/seeds/', file);
  },
};
class Schema {}
class Lucid {}

const setup = exports = module.exports = {};

setup.start = function * () {
  yield fs.emptyDir(path.join(__dirname, '../app'));
};

setup.end = setup.start;

setup.registerProviders = () => {
  fold.Ioc.bind('Adonis/Src/Helpers', () => Helpers);
  fold.Ioc.bind('Schema', () => Schema);
  fold.Ioc.bind('Lucid', () => Lucid);
  fold.Ioc.bind('Factory', () => {});
  fold.Ioc.alias('Command', 'Adonis/Src/Command');

  return fold.Registrar.register([
    'adonis-ace/providers/CommandProvider',
    path.join(__dirname, '../../../providers/GeneratorsProvider'),
  ]);
};

setup.registerCommands = () => {
  Ace.register([
    'AdonisGenerators/Generate:Migration',
    'AdonisGenerators/Generate:Model',
  ]);
};

setup.invokeCommand = (command, args, options) => Ace.call(command, args, options);
