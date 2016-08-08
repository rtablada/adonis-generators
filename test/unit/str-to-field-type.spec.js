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
const path = require('path');
const expect = chai.expect;
const strToFieldType = require('../../src/helpers/str-to-field-type');

describe('strToFieldType', () => {
  const fieldStrings = {
    integer: 'age:integer',
    string: 'name:string',
    boolean: 'drive:boolean',

    belongsTo: 'post:belongsTo',
    belongsToWithModel: 'author:belongsTo:User',
    belongsToWithModelAndForeignKey: 'teacher:belongsTo:User:instructor_id',

    hasMany: 'dogs:hasMany',
    hasManyWithModel: 'startups:hasMany:Business',
    hasManyWithModelAndForeignKey: 'groups:hasMany:Cohort:instructor_id',
  };

  it('should know how to parse raw data types', () => {
    expect(strToFieldType(fieldStrings.integer)).to.deep.equal({
      name: 'age',
      type: 'integer',
      raw: 'age:integer',
      relation: undefined,
    });

    expect(strToFieldType(fieldStrings.string)).to.deep.equal({
      name: 'name',
      type: 'string',
      raw: 'name:string',
      relation: undefined,
    });

    expect(strToFieldType(fieldStrings.boolean)).to.deep.equal({
      name: 'drive',
      type: 'boolean',
      raw: 'drive:boolean',
      relation: undefined,
    });
  });

  it('should know how to parse belongsTo relationships with all fields', () => {
    expect(strToFieldType(fieldStrings.belongsToWithModelAndForeignKey)).to.deep.equal({
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
    expect(strToFieldType(fieldStrings.hasManyWithModelAndForeignKey)).to.deep.equal({
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
});
