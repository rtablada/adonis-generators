'use strict';

/**
 * ado.nis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
/* global describe, it, before, after, context */
const chai = require('chai');
const setup = require('./setup');
const expect = chai.expect;
require('co-mocha');

describe('Generators', () => {
  before(function * () {
    yield setup.start();
    yield setup.registerProviders();
    setup.registerCommands();
  });

  after(function * () {
    yield setup.end();
  });

  context('Migration', () => {
    it('should create a new migration', function * () {
      yield setup.invokeCommand('g:migration', ['User']);
      const UserSchema = require('./app/migrations/User.js');
      expect(UserSchema.name).to.equal('UserSchema');
      expect(typeof (new UserSchema().up)).to.equal('function');
      expect(typeof (new UserSchema().down)).to.equal('function');
    });
  });

  context('Model', () => {
    it('should create a new model', function * () {
      yield setup.invokeCommand('make:model', ['User'], {});
      const UserModel = require('./app/Model/User.js');
      expect(UserModel.name).to.equal('User');
    });
  });
});
