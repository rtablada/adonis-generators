'use strict';

/**
 * adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/* global describe, it, before, beforeEach, after, context */
const chai = require('chai');
const expect = chai.expect;
const strToFieldType = require('../../src/helpers/str-to-field-type');

describe('strToFieldType', () => {
  const fieldStrings = {
    integer: 'age:integer',
    string: 'name:string',
    boolean: 'drive:boolean',

    belongsTo: 'post:belongsTo',
    belongsToWithModel: 'author:belongsTo:User',
    belongsToWithForeignKey: 'teacher:belongsTo:User:instructor_id',

    hasMany: 'dogs:hasMany',
    hasManyWithModel: 'startups:hasMany:Business',
    hasManyWithForeignKey: 'groups:hasMany:Cohort:instructor_id',
  };

  const currentModelName = 'Pokemon';

  it('should know how to parse raw data types', () => {
    expect(strToFieldType(fieldStrings.integer, currentModelName)).to.deep.equal({
      name: 'age',
      type: 'integer',
      raw: 'age:integer',
      relation: undefined,
    });

    expect(strToFieldType(fieldStrings.string, currentModelName)).to.deep.equal({
      name: 'name',
      type: 'string',
      raw: 'name:string',
      relation: undefined,
    });

    expect(strToFieldType(fieldStrings.boolean, currentModelName)).to.deep.equal({
      name: 'drive',
      type: 'boolean',
      raw: 'drive:boolean',
      relation: undefined,
    });
  });

  it('should know how to parse belongsTo relationships with all fields', () => {
    expect(strToFieldType(fieldStrings.belongsToWithForeignKey, currentModelName)).to.deep.equal({
      name: 'teacher',
      type: 'relation',
      raw: 'teacher:belongsTo:User:instructor_id',
      relation: {
        type: 'belongsTo',
        modelName: 'User',
        foreignKey: 'instructor_id',
      },
    });
  });

  it('should know how to parse hasMany relationships with all fields', () => {
    expect(strToFieldType(fieldStrings.hasManyWithForeignKey, currentModelName)).to.deep.equal({
      name: 'groups',
      type: 'relation',
      raw: 'groups:hasMany:Cohort:instructor_id',
      relation: {
        type: 'hasMany',
        modelName: 'Cohort',
        foreignKey: 'instructor_id',
      },
    });
  });

  it('should know how to parse belongsTo relationships with no foreignKey', () => {
    expect(strToFieldType(fieldStrings.belongsToWithModel, currentModelName)).to.deep.equal({
      name: 'author',
      type: 'relation',
      raw: 'author:belongsTo:User',
      relation: {
        type: 'belongsTo',
        modelName: 'User',
        foreignKey: 'user_id',
      },
    });
  });

  it('should know how to parse hasMany relationships with no foreignKey', () => {
    expect(strToFieldType(fieldStrings.hasManyWithModel, currentModelName)).to.deep.equal({
      name: 'startups',
      type: 'relation',
      raw: 'startups:hasMany:Business',
      relation: {
        type: 'hasMany',
        modelName: 'Business',
        foreignKey: 'pokemon_id',
      },
    });
  });

  it('should know how to parse belongsTo relationships with no model', () => {
    expect(strToFieldType(fieldStrings.belongsTo, currentModelName)).to.deep.equal({
      name: 'post',
      type: 'relation',
      raw: 'post:belongsTo',
      relation: {
        type: 'belongsTo',
        modelName: 'Post',
        foreignKey: 'post_id',
      },
    });
  });

  it('should know how to parse hasMany relationships with no model', () => {
    expect(strToFieldType(fieldStrings.hasMany, currentModelName)).to.deep.equal({
      name: 'dogs',
      type: 'relation',
      raw: 'dogs:hasMany',
      relation: {
        type: 'hasMany',
        modelName: 'Dog',
        foreignKey: 'pokemon_id',
      },
    });
  });
});
