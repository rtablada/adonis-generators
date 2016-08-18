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

/* global describe, it, before, beforeEach, after, context */
const Ioc = require('adonis-fold').Ioc;
const chai = require('chai');
const path = require('path');
const fs = require('co-fs-extra');
const expect = chai.expect;
require('co-mocha');

class Command {
  completed() {}
}

Ioc.bind('Adonis/Src/Command', () => Command);

const Generator = require('../../src/Generators/Base');
const ModelGenerator = require('../../src/Generators/Model');
const MigrationGenerator = require('../../src/Generators/Migration');

const Helpers = {
  appPath: () => path.join(__dirname, './app'),
  migrationsPath: (fileName) => {
    const file = fileName.replace(/\d+_/g, '');

    return path.join(__dirname, './app/migrations/', file);
  },
  basePath() {
    return this.appPath();
  },
};

describe('Generator', () => {
  before(function * () {
    yield fs.emptyDir(path.join(__dirname, './app'));
  });

  after(function * () {
    yield fs.emptyDir(path.join(__dirname, './app'));
  });

  it('should not prefix the entity when not required', () => {
    const gen = new Generator();
    const modelName = gen._makeEntityName('usersmodel', 'model', false);
    expect(modelName.entityName).to.equal('Users');
  });

  it('should singularize a name when defined', () => {
    const gen = new Generator();
    const modelName = gen._makeEntityName('usersmodel', 'model', false, 'singular');
    expect(modelName.entityName).to.equal('User');
  });

  context('Model', () => {
    before(() => {
      Ioc.bind('Lucid', () => class Lucid {});
    });
    it('should create a model file', function * () {
      const modelGen = new ModelGenerator(Helpers);
      yield modelGen.handle({ name: 'UsersModel' }, {});
      const Model = require(path.join(Helpers.appPath(), 'Model/User.js'));
      expect(Model.name).to.equal('User');
    });

    it('should specify table name when defined', function * () {
      const modelGen = new ModelGenerator(Helpers);
      yield modelGen.handle({ name: 'Supplier' }, { table: 'allSupplier' });
      const Model = require(path.join(Helpers.appPath(), 'Model/Supplier.js'));
      expect(Model.table).to.equal('allSupplier');
    });

    it('should specify connection name when defined', function * () {
      const modelGen = new ModelGenerator(Helpers);
      yield modelGen.handle({ name: 'Profile' }, { connection: 'Mysql' });
      const Model = require(path.join(Helpers.appPath(), 'Model/Profile.js'));
      expect(Model.connection).to.equal('Mysql');
    });

    it('should create a nested model file', function * () {
      const modelGen = new ModelGenerator(Helpers);
      yield modelGen.handle({ name: 'Admin/UsersModel' }, {});
      const Model = require(path.join(Helpers.appPath(), 'Model/Admin/User.js'));
      expect(Model.name).to.equal('User');
    });
  });

  context('Migrations', () => {
    beforeEach(() => {
      class Schema {
        constructor() {
          this.payload = {};
        }
        create(table) {
          this.payload = {
            method: 'create',
            table,
          };
        }
        table(table) {
          this.payload = {
            method: 'table',
            table,
          };
        }
      }
      Ioc.bind('Schema', () => Schema);
    });

    function createMigrationGenerator() {
      const migrationGen = new MigrationGenerator(Helpers);
      migrationGen.command = {
        parent: {
          args: [],
        },
      };

      return migrationGen;
    }

    it('should create a migrations file', function * () {
      const migrationGen = createMigrationGenerator();
      yield migrationGen.handle({ name: 'User' }, {});
      const Migration = require(Helpers.migrationsPath('User'));
      expect(Migration.name).to.equal('UserSchema');
      const migrationInstance = new Migration();
      expect(migrationInstance.up).to.be.a('function');
      expect(migrationInstance.down).to.be.a('function');
    });

    it('should call create method when passing --create flag', function * () {
      const migrationGen = createMigrationGenerator();
      yield migrationGen.handle({ name: 'Account' }, { create: 'accounts' });
      const Migration = require(Helpers.migrationsPath('Account'));
      expect(Migration.name).to.equal('AccountSchema');
      const migrationInstance = new Migration();
      migrationInstance.up();
      expect(migrationInstance.payload.method).to.equal('create');
      expect(migrationInstance.payload.table).to.equal('accounts');
    });
  });
});
